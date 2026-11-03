#!/usr/bin/env node
// Developer and agent commands for this repository. Run `bun repo help` from the repository root.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DEFAULT_BASE = 'origin/main';
const OUTPUT_TAIL_LINES = 80;
const TURBO = './node_modules/.bin/turbo';

const BIOME_FILE = /\.(js|mjs|cjs|ts|svelte|json|jsonc|css|md|html|ya?ml)$/;
const RELEASED_SOURCE = /^(packages\/sivir\/(src|cli)|apps\/docs\/src)\//;
const COMPONENT_SOURCE = /^(packages\/sivir\/src|apps\/docs\/src)\//;

/** Root files that change what every workspace installs or runs, so they check all of them. */
const ROOT_DEPENDENCY_FILES = new Set(['bun.lock', 'package.json', 'turbo.json']);

/** Workspaces by folder. A change in one type checks it and every workspace that depends on it. */
const WORKSPACES = [
    {
        folder: 'packages/sivir/',
        name: '@sivir-ui/svelte'
    },
    {
        folder: 'apps/docs/',
        name: 'docs'
    },
    {
        folder: 'apps/registry/',
        name: 'registry'
    },
    {
        folder: 'apps/installer-lab/',
        name: 'installer-lab'
    }
];

/** The status labels of the pull request loop in AGENTS.md, keyed by the name `repo pr` takes. */
const PULL_REQUEST_STATES = {
    'in-progress': 'pr:in-progress',
    ready: 'pr:ready',
    'needs-human': 'pr:needs-human'
};

/** Ignored files that are caches or are recreated by a command, so removing them loses nothing. */
const REPRODUCIBLE_IGNORED = [
    /(^|\/)node_modules\//,
    /(^|\/)\.svelte-kit\//,
    /(^|\/)\.turbo\//,
    /(^|\/)\.vite\//,
    /(^|\/)(build|dist|coverage|test-results|playwright-report|\.release|\.sandbox)\//,
    /(^|\/)\.vitest-attachments\//,
    /(^|\/)\.vercel\//,
    /^apps\/registry\/prisma\/generated\//,
    /^packages\/sivir\/registry\//,
    /(^|\/)\.DS_Store$/,
    /\.tsbuildinfo$/
];

const USAGE = `Usage: bun repo <command>

  check [--all] [--fix] [--browser] [--base <ref>]
      Runs the checks the changed files need, in parallel, and exits non-zero if any fails.
      Changed files are those that differ from the merge base with --base (default ${DEFAULT_BASE}),
      plus uncommitted and untracked files. --all checks everything, browser tests included.
      --fix lets Biome write, and --browser runs the docs browser tests when component or docs
      source changed.
  worktrees [--prune]
      Lists this repository's worktrees and whether each is safe to remove. --prune removes those
      whose pull request merged and that hold no uncommitted, unpushed or ignored work.
  pr <number> <${Object.keys(PULL_REQUEST_STATES).join('|')}>
      Sets the pull request's pr: status label and removes the other pr: labels.
`;

const COMMANDS = {
    check: (args) => {
        return check(parseFlags(args));
    },
    worktrees: (args) => {
        return worktrees(parseFlags(args));
    },
    pr: setPullRequestState,
    help: printUsage
};

const [commandName = 'help', ...commandArgs] = process.argv.slice(2);
const command = COMMANDS[commandName];

if (!command) {
    console.error(`Unknown command "${commandName}".\n`);
    printUsage();
    process.exit(2);
}

process.exitCode = await command(commandArgs);

function printUsage() {
    console.log(USAGE);

    return 0;
}

// ---------- check ----------

/** One check: the files that make it run, and the command that runs it. */
function checkTasks(flags) {
    const fix = flags.fix === true;
    const biomeMode = fix ? ['--write'] : [];

    return [
        {
            name: 'Biome',
            select: (file) => {
                return BIOME_FILE.test(file);
            },
            command: (files) => {
                return [
                    'bunx',
                    ['biome', 'check', ...biomeMode, '--no-errors-on-unmatched', ...files]
                ];
            },
            runAll: () => {
                return ['bunx', ['biome', 'check', ...biomeMode, '.']];
            }
        },
        {
            name: 'Types',
            select: (file) => {
                return workspaceOf(file) !== null || isRootDependencyFile(file);
            },
            command: (files) => {
                if (files.some(isRootDependencyFile)) {
                    return [TURBO, ['run', 'check']];
                }

                return [TURBO, ['run', 'check', ...dependentFilters(files)]];
            },
            runAll: () => {
                return [TURBO, ['run', 'check']];
            }
        },
        {
            name: 'Tests (sivir)',
            select: (file) => {
                return file.startsWith('packages/sivir/') || isRootDependencyFile(file);
            },
            command: () => {
                return ['bun', ['run', '--cwd', 'packages/sivir', 'test']];
            }
        },
        {
            name: 'Tests (docs)',
            select: (file) => {
                return (
                    file.startsWith('apps/docs/') ||
                    file.startsWith('packages/sivir/src/') ||
                    isRootDependencyFile(file)
                );
            },
            command: () => {
                return ['bun', ['run', '--cwd', 'apps/docs', 'test:ci']];
            }
        },
        {
            name: 'Tests (registry)',
            select: (file) => {
                return file.startsWith('apps/registry/') || isRootDependencyFile(file);
            },
            command: () => {
                return [TURBO, ['run', 'test', '--filter=registry']];
            }
        },
        {
            name: 'Tests (installer)',
            select: (file) => {
                return file.startsWith('apps/installer-lab/') || isRootDependencyFile(file);
            },
            command: () => {
                return ['bun', ['run', '--cwd', 'apps/installer-lab', 'test']];
            }
        },
        {
            name: 'Tests (scripts)',
            select: (file) => {
                return file.startsWith('scripts/');
            },
            command: () => {
                return ['bun', ['test', './scripts']];
            }
        },
        {
            name: 'Browser tests',
            select: (file) => {
                return COMPONENT_SOURCE.test(file);
            },
            command: () => {
                if (flags.browser !== true && flags.all !== true) {
                    return null;
                }

                return ['bun', ['run', '--cwd', 'apps/docs', 'test:browser']];
            },
            skippedReason: 'Component or docs source changed. Run `bun repo check --browser`.'
        },
        {
            name: 'Changelog',
            select: (file) => {
                return RELEASED_SOURCE.test(file);
            },
            check: (files) => {
                return checkChangelog(files, flags.changedFiles);
            }
        }
    ];
}

async function check(flags) {
    const files = flags.all === true ? null : changedFiles(flags.base ?? DEFAULT_BASE);

    if (files !== null && files.length === 0) {
        console.log('No changed files. Run `bun repo check --all` to check everything.');

        return 0;
    }

    const tasks = checkTasks({
        ...flags,
        changedFiles: files ?? []
    });
    const runs = planChecks(tasks, files);

    if (runs.length === 0) {
        console.log(`${files.length} changed files, none of them checked by repo.`);

        return 0;
    }

    const scope = files === null ? 'everything' : `${files.length} changed files`;
    const names = runs.map((run) => {
        return run.task.name;
    });

    console.log(`Checking ${scope}: ${names.join(', ')}\n`);

    const results = await Promise.all(runs.map(runCheck));

    return reportResults(results);
}

function planChecks(tasks, files) {
    return tasks.flatMap((task) => {
        if (files === null) {
            if (task.check) {
                return [];
            }

            const invocation = (task.runAll ?? task.command)([]);

            return [
                {
                    task,
                    files: [],
                    invocation
                }
            ];
        }

        const selected = files.filter(task.select);

        if (selected.length === 0) {
            return [];
        }

        return [
            {
                task,
                files: selected,
                invocation: task.check ? undefined : task.command(selected)
            }
        ];
    });
}

async function runCheck({ task, files, invocation }) {
    if (task.check) {
        const problem = task.check(files);

        return {
            name: task.name,
            status: problem === null ? 'passed' : 'failed',
            output: problem ?? '',
            seconds: 0
        };
    }

    if (invocation === null) {
        return {
            name: task.name,
            status: 'not run',
            output: task.skippedReason,
            seconds: 0
        };
    }

    const [executable, args] = invocation;
    const started = Date.now();
    const { exitCode, output } = await run(executable, args);

    return {
        name: task.name,
        status: exitCode === 0 ? 'passed' : 'failed',
        output,
        seconds: (Date.now() - started) / 1000
    };
}

function reportResults(results) {
    const symbols = {
        passed: '✓',
        failed: '✗',
        'not run': '–'
    };

    for (const result of results) {
        const seconds = `${result.seconds.toFixed(1)}s`;

        console.log(
            `${symbols[result.status]} ${result.name.padEnd(18)} ${result.status.padEnd(8)} ${seconds}`
        );
    }

    const problems = results.filter((result) => {
        return result.status !== 'passed';
    });

    for (const result of problems) {
        console.log(
            `\n── ${result.name} (${result.status}) ──\n${lastLines(result.output, OUTPUT_TAIL_LINES)}`
        );
    }

    return problems.length === 0 ? 0 : 1;
}

/** AGENTS.md asks for a changelog bullet with every change that ships in the package or docs. */
function checkChangelog(releasedFiles, allFiles) {
    const hasChangelogEntry = allFiles.some((file) => {
        return file.startsWith('changelog/');
    });

    if (hasChangelogEntry) {
        return null;
    }

    return [
        `${releasedFiles.length} package or docs files changed with no changelog entry.`,
        'Add a bullet to changelog/<next-release-version>/<change-type>.md (see AGENTS.md).'
    ].join('\n');
}

function dependentFilters(files) {
    const names = new Set(
        files.map((file) => {
            return workspaceOf(file);
        })
    );

    return [...names].map((name) => {
        return `--filter=...${name}`;
    });
}

function isRootDependencyFile(file) {
    return ROOT_DEPENDENCY_FILES.has(file);
}

function workspaceOf(file) {
    const workspace = WORKSPACES.find((candidate) => {
        return file.startsWith(candidate.folder);
    });

    return workspace?.name ?? null;
}

/** Files that differ from the merge base with `base`, plus uncommitted and untracked ones. */
function changedFiles(base) {
    const mergeBase = git(['merge-base', base, 'HEAD']).trim();
    const lists = [
        git(['diff', '--name-only', '--no-renames', '-z', mergeBase]),
        git(['ls-files', '--others', '--exclude-standard', '-z'])
    ];
    const files = new Set(
        lists
            .flatMap((list) => {
                return list.split('\0');
            })
            .filter(Boolean)
    );

    return [...files]
        .filter((file) => {
            return existsSync(resolve(REPO_ROOT, file));
        })
        .sort();
}

// ---------- worktrees ----------

function worktrees(flags) {
    const current = git(['rev-parse', '--show-toplevel']).trim();
    // git lists the main checkout first. It and the checkout running this are never candidates.
    const [, ...linked] = parseWorktrees(git(['worktree', 'list', '--porcelain']));
    const audited = linked
        .filter((entry) => {
            return entry.path !== current;
        })
        .map(auditWorktree);

    for (const entry of audited) {
        const verdict = entry.removable ? 'removable' : 'keep     ';

        console.log(`${verdict}  ${entry.branch ?? '(detached)'}  ${entry.path}`);

        if (!entry.removable) {
            console.log(`           ${entry.reasons.join('; ')}`);
        }
    }

    if (flags.prune !== true) {
        console.log('\nRun `bun repo worktrees --prune` to remove the removable ones.');

        return 0;
    }

    return pruneWorktrees(audited);
}

function pruneWorktrees(audited) {
    let failures = 0;

    for (const entry of audited.filter((candidate) => candidate.removable)) {
        const removal = spawnSync('git', ['worktree', 'remove', entry.path], {
            cwd: REPO_ROOT,
            encoding: 'utf8'
        });

        if (removal.status === 0) {
            console.log(`removed ${entry.path}`);
        } else {
            failures += 1;
            console.log(`could not remove ${entry.path}: ${removal.stderr.trim()}`);
        }
    }

    git(['worktree', 'prune']);

    return failures === 0 ? 0 : 1;
}

function parseWorktrees(porcelain) {
    return porcelain
        .trim()
        .split('\n\n')
        .map((block) => {
            const lines = block.split('\n');
            const path = lineValue(lines, 'worktree ');
            const branchRef = lineValue(lines, 'branch ');

            return {
                path,
                branch: branchRef?.replace('refs/heads/', '') ?? null
            };
        })
        .filter((entry) => {
            return entry.path;
        });
}

function lineValue(lines, prefix) {
    const line = lines.find((candidate) => {
        return candidate.startsWith(prefix);
    });

    return line?.slice(prefix.length);
}

function auditWorktree(entry) {
    if (!existsSync(entry.path)) {
        return {
            ...entry,
            removable: true,
            reasons: []
        };
    }

    const reasons = [];
    const inWorktree = (args) => {
        return git(['-C', entry.path, ...args]);
    };

    if (inWorktree(['status', '--porcelain']).trim()) {
        reasons.push('uncommitted changes');
    }

    const ignored = unreproducibleIgnoredFiles(inWorktree(['status', '--porcelain', '--ignored']));

    if (ignored.length > 0) {
        reasons.push(`ignored files: ${ignored.slice(0, 3).join(', ')}`);
    }

    if (entry.branch === null) {
        reasons.push('detached HEAD');
    } else {
        reasons.push(...branchReasons(entry));
    }

    return {
        ...entry,
        removable: reasons.length === 0,
        reasons
    };
}

function unreproducibleIgnoredFiles(status) {
    return status
        .split('\n')
        .filter((line) => {
            return line.startsWith('!! ');
        })
        .map((line) => {
            return line.slice(3);
        })
        .filter((file) => {
            return !REPRODUCIBLE_IGNORED.some((pattern) => {
                return pattern.test(file);
            });
        });
}

function branchReasons(entry) {
    const reasons = [];
    const unpushed = gitOrNull(['-C', entry.path, 'rev-list', '--count', '@{upstream}..HEAD']);

    if (unpushed === null) {
        reasons.push('no upstream branch');
    } else if (Number(unpushed) > 0) {
        reasons.push(`${unpushed.trim()} unpushed commits`);
    }

    const state = pullRequestState(entry.branch);

    if (state !== 'MERGED') {
        reasons.push(state ? `pull request ${state.toLowerCase()}` : 'no pull request');
    }

    return reasons;
}

function pullRequestState(branch) {
    return gh([
        'pr',
        'list',
        '--head',
        branch,
        '--state',
        'all',
        '--json',
        'state',
        '--jq',
        '.[0].state'
    ]).trim();
}

// ---------- pr ----------

function setPullRequestState([number, state, ...rest]) {
    const label = Object.hasOwn(PULL_REQUEST_STATES, state) ? PULL_REQUEST_STATES[state] : null;

    if (!/^\d+$/.test(number ?? '') || label === null || rest.length > 0) {
        console.error(
            `Usage: bun repo pr <number> <${Object.keys(PULL_REQUEST_STATES).join('|')}>`
        );

        return 2;
    }

    const labelsPath = `repos/{owner}/{repo}/issues/${number}/labels`;
    const current = gh(['api', labelsPath, '--jq', '.[].name']).split('\n');
    const stale = current.filter((name) => {
        return name.startsWith('pr:') && name !== label;
    });

    for (const name of stale) {
        gh(['api', '--method', 'DELETE', `${labelsPath}/${encodeURIComponent(name)}`]);
    }

    gh(['api', '--method', 'POST', labelsPath, '-f', `labels[]=${label}`]);
    console.log(`#${number} is now ${label}`);

    return 0;
}

// ---------- helpers ----------

function parseFlags(args) {
    const flags = {};

    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];

        if (!arg.startsWith('--')) {
            throw new Error(`Unexpected argument "${arg}". Run \`bun repo help\`.`);
        }

        const name = arg.slice(2);

        if (name !== 'base') {
            flags[name] = true;
            continue;
        }

        index += 1;
        flags.base = args[index];

        if (!flags.base) {
            throw new Error('--base needs a value');
        }
    }

    return flags;
}

function git(args) {
    return runOrThrow('git', args);
}

function gh(args) {
    return runOrThrow('gh', args);
}

function runOrThrow(executable, args) {
    const result = spawnSync(executable, args, {
        cwd: REPO_ROOT,
        encoding: 'utf8'
    });

    if (result.status !== 0) {
        throw new Error(`${executable} ${args.join(' ')} failed: ${result.stderr.trim()}`);
    }

    return result.stdout;
}

function gitOrNull(args) {
    const result = spawnSync('git', args, {
        cwd: REPO_ROOT,
        encoding: 'utf8'
    });

    return result.status === 0 ? result.stdout : null;
}

/** Runs a command, collecting its interleaved output, and resolves with its exit code. */
function run(executable, args) {
    return new Promise((resolvePromise) => {
        const child = spawn(executable, args, {
            cwd: REPO_ROOT,
            env: {
                ...process.env,
                FORCE_COLOR: '0',
                NO_COLOR: '1',
                LEFTHOOK: '0'
            }
        });
        let output = '';

        child.stdout.on('data', (chunk) => {
            output += chunk;
        });
        child.stderr.on('data', (chunk) => {
            output += chunk;
        });
        child.on('error', (error) => {
            resolvePromise({
                exitCode: 1,
                output: `${output}\n${error.message}`
            });
        });
        child.on('close', (code) => {
            resolvePromise({
                exitCode: code ?? 1,
                output
            });
        });
    });
}

function lastLines(text, count) {
    const lines = text.trimEnd().split('\n');

    if (lines.length <= count) {
        return lines.join('\n');
    }

    return [`… ${lines.length - count} earlier lines`, ...lines.slice(-count)].join('\n');
}
