/**
 * silk CLI sandbox -- a throwaway SvelteKit-shaped project for exercising the
 * built `silk` binary against a fresh install. For CLI developers; this is not
 * shipped to library users (scripts/ is outside the published `files`).
 *
 *   bun run sandbox                  # build, ensure an app, drop into a shell
 *   bun run sandbox add button       # run `silk add button` in the sandbox app
 *   bun run sandbox init -y          # any silk command works implicitly
 *   bun run sandbox scenario         # scripted end-to-end run with assertions
 *   bun run sandbox reset [--bare]   # recreate the app (bare = omit peer deps)
 *   bun run sandbox clean            # delete the sandbox entirely
 *
 * Prepend --no-build to skip rebuilding the CLI first:
 *
 *   bun run sandbox --no-build add card
 *
 * The sandbox app accumulates across `add` runs so you can build up a project
 * incrementally; `reset` and `scenario` wipe it first. Everything lives under
 * the gitignored `.sandbox/` directory.
 */

import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import { gradientLine } from '../src/utils/ui';

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distEntry = path.join(cliRoot, 'dist/index.js');
const sandboxRoot = path.join(cliRoot, '.sandbox');
const appDir = path.join(sandboxRoot, 'app');
const binDir = path.join(sandboxRoot, 'bin');

/** Framework-level peers a real consumer project would already have. */
const FRAMEWORK_PEERS: Record<string, string> = {
	svelte: '^5.0.0',
	tailwindcss: '^4.0.0'
};

/** Component-level peers silk pulls; omitted by `reset --bare` so the
 * missing-peer warning path can be exercised. */
const COMPONENT_PEERS: Record<string, string> = {
	clsx: '^2.0.0',
	'tailwind-merge': '^3.0.0',
	'tailwind-variants': '^3.0.0',
	'@floating-ui/dom': '^1.0.0',
	'@lucide/svelte': '^1.0.0',
	'fuse.js': '^7.0.0'
};

function header(text: string) {
	console.log();
	console.log('  ' + gradientLine(text));
	console.log();
}

const dim = (message: string) => console.log(pc.dim(`  ${message}`));

/** (Re)writes the sandbox app from scratch. */
function createApp(bare: boolean) {
	rmSync(appDir, { recursive: true, force: true });
	mkdirSync(path.join(appDir, 'src/lib'), { recursive: true });
	mkdirSync(path.join(appDir, 'src/routes'), { recursive: true });

	const devDependencies = bare
		? { ...FRAMEWORK_PEERS }
		: { ...FRAMEWORK_PEERS, ...COMPONENT_PEERS };

	writeFileSync(
		path.join(appDir, 'package.json'),
		JSON.stringify(
			{
				name: 'silk-sandbox-app',
				private: true,
				type: 'module',
				version: '0.0.0',
				devDependencies
			},
			null,
			'\t'
		) + '\n'
	);

	// `silk init` only checks that this file exists -- the sandbox exercises the
	// install flow, not a running SvelteKit app, so the fixture stays empty.
	writeFileSync(
		path.join(appDir, 'svelte.config.js'),
		'/** Fixture for the silk CLI sandbox -- its presence satisfies `silk init`. */\nexport default {};\n'
	);

	// Empty lockfile so the CLI detects bun as the package manager.
	writeFileSync(path.join(appDir, 'bun.lock'), '');

	writeFileSync(
		path.join(appDir, 'src/app.css'),
		[
			'/* silk token system -- available after `silk init`. */',
			"@import './lib/silk/ui.css';",
			'/* Theme overrides -- available after `silk add theme <slug>`: */',
			"/* @import './lib/silk/theme.css'; */",
			''
		].join('\n')
	);

	writeFileSync(
		path.join(appDir, 'src/routes/+page.svelte'),
		[
			'<script lang="ts">',
			'\t// After `silk add button`, uncomment to render the real component:',
			"\t// import { Button } from '$lib/silk/components/button';",
			'</script>',
			'',
			'<main>',
			'\t<h1>silk sandbox</h1>',
			'\t<p>Run <code>silk add button</code>, then import from <code>$lib/silk</code>.</p>',
			'\t<!-- <Button>Click me</Button> -->',
			'</main>',
			''
		].join('\n')
	);

	writeFileSync(
		path.join(appDir, 'README.md'),
		[
			'# silk CLI sandbox (generated)',
			'',
			'Ephemeral SvelteKit-shaped project for exercising the local `silk` build.',
			'Created and reset by `packages/cli/scripts/sandbox.ts`; everything under',
			'`.sandbox/` is gitignored. Edits here are disposable -- `bun run sandbox reset`',
			'recreates it from scratch.',
			''
		].join('\n')
	);
}

function ensureApp() {
	if (!existsSync(appDir)) {
		createApp(false);
		dim(`scaffolded a fresh app at ${path.relative(cliRoot, appDir)}`);
	}
}

function buildCli(noBuild: boolean) {
	if (noBuild) {
		if (!existsSync(distEntry)) {
			console.error(
				pc.red(`✖ ${path.relative(cliRoot, distEntry)} is missing -- drop --no-build.`)
			);
			process.exit(1);
		}
		return;
	}
	const result = spawnSync('bun', ['run', 'build'], { cwd: cliRoot, stdio: 'inherit' });
	if (result.status !== 0) {
		console.error(pc.red('✖ CLI build failed.'));
		process.exit(result.status ?? 1);
	}
}

/** Runs the freshly built `silk` binary inside the sandbox app. */
function runSilk(args: string[]) {
	return spawnSync('node', [distEntry, ...args], { cwd: appDir, stdio: 'inherit' }).status ?? 1;
}

/** Drops a `silk` shim onto PATH so it resolves to the local build in a shell. */
function writeShim() {
	mkdirSync(binDir, { recursive: true });
	const shim = path.join(binDir, 'silk');
	writeFileSync(shim, `#!/usr/bin/env bash\nexec node "${distEntry}" "$@"\n`);
	chmodSync(shim, 0o755);
}

function openShell(noBuild: boolean) {
	buildCli(noBuild);
	ensureApp();
	writeShim();

	header('silk sandbox');
	dim(`app:  ${path.relative(cliRoot, appDir)}`);
	dim(`silk: local build (${path.relative(cliRoot, distEntry)})`);
	console.log();
	console.log(`  ${pc.cyan('silk init -y')}      bootstrap the project`);
	console.log(`  ${pc.cyan('silk add button')}   install a component`);
	console.log(`  ${pc.cyan('silk list')}         browse the catalog`);
	console.log(`  ${pc.dim('exit')}              leave the sandbox`);
	console.log();

	const shell = process.env.SHELL || '/bin/bash';
	const result = spawnSync(shell, [], {
		cwd: appDir,
		stdio: 'inherit',
		env: { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ''}`, SILK_SANDBOX: '1' }
	});
	process.exit(result.status ?? 0);
}

function runImplicit(silkArgs: string[], noBuild: boolean) {
	if (silkArgs.length === 0) {
		printHelp();
		process.exit(1);
	}
	buildCli(noBuild);
	ensureApp();
	process.exit(runSilk(silkArgs));
}

// --- scenario: scripted end-to-end run against a fresh app ------------------

function read(rel: string) {
	return readFileSync(path.join(appDir, rel), 'utf8');
}

function exists(rel: string) {
	return existsSync(path.join(appDir, rel));
}

type Step = {
	label: string;
	args: string[];
	/** Returns the list of failed assertions; empty means the step passed. */
	check: () => string[];
};

const SILK = 'src/lib/silk';

const SCENARIO: Step[] = [
	{
		label: 'silk init -y',
		args: ['init', '-y'],
		check: () => {
			const failures: string[] = [];
			for (const file of [
				'silk.json',
				`${SILK}/ui.css`,
				`${SILK}/utils.ts`,
				`${SILK}/internals/state.svelte.ts`
			]) {
				if (!exists(file)) failures.push(`missing ${file}`);
			}
			return failures;
		}
	},
	{
		label: 'silk add command (transitive deps)',
		args: ['add', 'command'],
		check: () => {
			const failures: string[] = [];
			for (const file of [
				`${SILK}/components/command/command.svelte`,
				`${SILK}/components/popover/popover.svelte`,
				`${SILK}/components/button/button.svelte`
			]) {
				if (!exists(file)) failures.push(`missing ${file}`);
			}
			const button = exists(`${SILK}/components/button/button.svelte`)
				? read(`${SILK}/components/button/button.svelte`)
				: '';
			if (!button.includes('$lib/silk')) failures.push('imports not rewritten to $lib/silk');
			if (button.includes('@silk/ui')) failures.push('stale @silk/ui import remains');
			return failures;
		}
	},
	{
		label: 'silk add theme default',
		args: ['add', 'theme', 'default'],
		check: () => {
			if (!exists(`${SILK}/theme.css`)) return [`missing ${SILK}/theme.css`];
			return read(`${SILK}/theme.css`).includes('@theme') ? [] : ['theme.css has no @theme block'];
		}
	},
	{
		label: 'silk add button (idempotent re-add)',
		args: ['add', 'button'],
		check: () => []
	}
];

function runScenario(noBuild: boolean) {
	buildCli(noBuild);
	createApp(false);
	header('silk sandbox · scenario');

	const results: { label: string; failures: string[]; status: number }[] = [];
	for (const step of SCENARIO) {
		console.log(pc.bold(`▸ ${step.label}`));
		const status = runSilk(step.args);
		const failures = step.check();
		if (status !== 0) failures.unshift(`exit code ${status}`);
		results.push({ label: step.label, failures, status });
		console.log();
	}

	header('results');
	let failed = 0;
	for (const result of results) {
		if (result.failures.length === 0) {
			console.log(`  ${pc.green('✔')} ${result.label}`);
		} else {
			failed++;
			console.log(`  ${pc.red('✖')} ${result.label}`);
			for (const failure of result.failures) console.log(`    ${pc.red(failure)}`);
		}
	}
	console.log();
	if (failed > 0) {
		console.log(`  ${pc.red(`${failed} of ${results.length} steps failed`)}`);
		process.exit(1);
	}
	console.log(`  ${pc.green(`all ${results.length} steps passed`)}`);
	dim(`inspect the result at ${path.relative(cliRoot, appDir)}`);
}

function printHelp() {
	header('silk sandbox');
	console.log('  Exercise the local silk build against a throwaway project.');
	console.log();
	console.log(`  ${pc.cyan('bun run sandbox')}                  build + drop into a shell`);
	console.log(`  ${pc.cyan('bun run sandbox <silk args>')}      run a silk command in the app`);
	console.log(
		`  ${pc.cyan('bun run sandbox scenario')}         scripted end-to-end with assertions`
	);
	console.log(
		`  ${pc.cyan('bun run sandbox reset [--bare]')}   recreate the app (bare omits peers)`
	);
	console.log(`  ${pc.cyan('bun run sandbox clean')}            delete the sandbox`);
	console.log();
	dim('prepend --no-build to skip rebuilding the CLI first');
	console.log();
}

// --- dispatch ---------------------------------------------------------------

let args = process.argv.slice(2);
let noBuild = false;
if (args[0] === '--no-build') {
	noBuild = true;
	args = args.slice(1);
}

const command = args[0];
switch (command) {
	case undefined:
		openShell(noBuild);
		break;
	case 'help':
	case '--help':
	case '-h':
		printHelp();
		break;
	case 'clean':
		rmSync(sandboxRoot, { recursive: true, force: true });
		dim('removed .sandbox');
		break;
	case 'reset':
		createApp(args.includes('--bare'));
		dim(
			`reset app at ${path.relative(cliRoot, appDir)}${args.includes('--bare') ? ' (bare)' : ''}`
		);
		break;
	case 'shell':
		openShell(noBuild);
		break;
	case 'scenario':
		runScenario(noBuild);
		break;
	case 'run':
		runImplicit(args.slice(1), noBuild);
		break;
	default:
		runImplicit(args, noBuild);
}
