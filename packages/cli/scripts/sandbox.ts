/**
 * silk CLI sandbox -- verifies the CLI works by running the built `silk` binary
 * against a throwaway, SvelteKit-shaped project under the gitignored `.sandbox/`.
 * For CLI developers; not shipped to library users (scripts/ is outside the
 * published `files`).
 *
 *   bun run sandbox                  # build, then run the full check suite
 *   bun run sandbox run add button   # run one silk command in the sandbox app
 *   bun run sandbox reset [--bare]   # recreate the app (bare = omit peer deps)
 *   bun run sandbox clean            # delete the sandbox
 *
 * Prepend --no-build to skip rebuilding the CLI first (`bun run sandbox --no-build`).
 *
 * The check suite exercises every command and guard by invoking the real binary
 * against a fresh install and asserting on the result; it exits non-zero if any
 * check fails. Use `run` to reproduce a failing command interactively.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import { gradientLine } from '../src/utils/ui';
import pkg from '../package.json';

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distEntry = path.join(cliRoot, 'dist/index.js');
const sandboxRoot = path.join(cliRoot, '.sandbox');
const appDir = path.join(sandboxRoot, 'app');

/** Directory `silk init` installs into by default; checks assert against it. */
const SILK = 'src/lib/silk';

/** Framework-level peers a real consumer project would already have. */
const FRAMEWORK_PEERS: Record<string, string> = {
	svelte: '^5.0.0',
	tailwindcss: '^4.0.0'
};

/** Component-level peers silk pulls; omitted by `--bare` so the missing-peer
 * warning path can be exercised. */
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

// --- check suite: run the real binary, capture output, assert ---------------

/** Runs `silk` in the sandbox app and captures combined output (no TTY, so the
 * CLI never prompts -- it takes the non-interactive branch everywhere). */
function silk(args: string[]): { status: number; out: string } {
	const result = spawnSync('node', [distEntry, ...args], { cwd: appDir, encoding: 'utf8' });
	return { status: result.status ?? 1, out: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

const exists = (rel: string) => existsSync(path.join(appDir, rel));
const read = (rel: string) => readFileSync(path.join(appDir, rel), 'utf8');
const config = () =>
	JSON.parse(read('silk.json')) as { components?: Record<string, string> } & Record<
		string,
		unknown
	>;

/** Fresh app + `silk init -y`; returns the init result for assertions. */
function initApp(bare = false) {
	createApp(bare);
	return silk(['init', '-y']);
}

type Check = { label: string; run: () => string[] };

const CHECKS: Check[] = [
	{
		label: 'init bootstraps silk.json + base files',
		run: () => {
			const f: string[] = [];
			const r = initApp();
			if (r.status !== 0) f.push(`init exited ${r.status}`);
			for (const file of [
				'silk.json',
				`${SILK}/ui.css`,
				`${SILK}/utils.ts`,
				`${SILK}/internals/state.svelte.ts`
			]) {
				if (!exists(file)) f.push(`missing ${file}`);
			}
			if (exists('silk.json')) {
				const cfg = config();
				if (cfg.dir !== 'src/lib/silk') f.push(`silk.json dir = ${String(cfg.dir)}`);
				if (cfg.alias !== '$lib/silk') f.push(`silk.json alias = ${String(cfg.alias)}`);
				if (!cfg.registry) f.push('silk.json missing registry');
			}
			return f;
		}
	},
	{
		label: 'init guards against re-initialising',
		run: () => {
			const f: string[] = [];
			initApp();
			const r = silk(['init', '-y']);
			if (r.status !== 0) f.push(`second init exited ${r.status}`);
			if (!r.out.includes('already exists')) f.push('no "already exists" notice');
			return f;
		}
	},
	{
		label: 'add installs files, rewrites imports, records version',
		run: () => {
			const f: string[] = [];
			initApp();
			const r = silk(['add', 'button']);
			if (r.status !== 0) f.push(`add button exited ${r.status}`);
			for (const file of ['button.svelte', 'index.ts', 'variants.ts']) {
				if (!exists(`${SILK}/components/button/${file}`)) f.push(`missing button/${file}`);
			}
			if (exists(`${SILK}/components/button/button.svelte`)) {
				const src = read(`${SILK}/components/button/button.svelte`);
				if (!src.includes('$lib/silk')) f.push('imports not rewritten to alias');
				if (src.includes('@silk/ui')) f.push('stale @silk/ui import remains');
			}
			if (!config().components?.button) f.push('silk.json did not record button');
			return f;
		}
	},
	{
		label: 'add resolves transitive deps (command → popover, button)',
		run: () => {
			const f: string[] = [];
			initApp();
			const r = silk(['add', 'command']);
			if (r.status !== 0) f.push(`add command exited ${r.status}`);
			for (const name of ['command', 'popover', 'button']) {
				if (!exists(`${SILK}/components/${name}`)) f.push(`missing component dir ${name}`);
				if (!config().components?.[name]) f.push(`silk.json missing ${name}`);
			}
			return f;
		}
	},
	{
		label: 'add pulls internal deps (modal → _internal/overlay)',
		run: () => {
			const f: string[] = [];
			initApp();
			const r = silk(['add', 'modal']);
			if (r.status !== 0) f.push(`add modal exited ${r.status}`);
			if (!exists(`${SILK}/components/_internal/overlay/overlay.svelte.ts`)) {
				f.push('internal overlay not installed');
			}
			if (!exists(`${SILK}/components/modal/modal.svelte`)) f.push('modal not installed');
			return f;
		}
	},
	{
		label: 'add accepts multiple components at once',
		run: () => {
			const f: string[] = [];
			initApp();
			const r = silk(['add', 'accordion', 'badge']);
			if (r.status !== 0) f.push(`add exited ${r.status}`);
			for (const name of ['accordion', 'badge']) {
				if (!config().components?.[name]) f.push(`silk.json missing ${name}`);
			}
			return f;
		}
	},
	{
		label: 'add is idempotent (re-add skips existing)',
		run: () => {
			const f: string[] = [];
			initApp();
			silk(['add', 'button']);
			const r = silk(['add', 'button']);
			if (r.status !== 0) f.push(`re-add exited ${r.status}`);
			if (!r.out.includes('already existed')) f.push('no skip notice on re-add');
			return f;
		}
	},
	{
		label: 'add --overwrite replaces modified files',
		run: () => {
			const f: string[] = [];
			initApp();
			silk(['add', 'button']);
			const target = `${SILK}/components/button/button.svelte`;
			writeFileSync(path.join(appDir, target), '// tampered\n');
			const r = silk(['add', 'button', '--overwrite']);
			if (r.status !== 0) f.push(`overwrite exited ${r.status}`);
			const src = exists(target) ? read(target) : '';
			if (src.includes('// tampered')) f.push('file not overwritten');
			if (!src.includes('$lib/silk')) f.push('overwritten file missing rewritten imports');
			return f;
		}
	},
	{
		label: 'add before init fails with guidance',
		run: () => {
			const f: string[] = [];
			createApp(false); // deliberately skip init
			const r = silk(['add', 'button']);
			if (r.status === 0) f.push('expected non-zero exit');
			if (!r.out.includes('silk init')) f.push('no "silk init" guidance');
			return f;
		}
	},
	{
		label: 'unknown component suggests the closest match',
		run: () => {
			const f: string[] = [];
			initApp();
			const r = silk(['add', 'buton']);
			if (r.status === 0) f.push('expected non-zero exit');
			if (!r.out.includes('did you mean')) f.push('no suggestion offered');
			if (!r.out.includes('button')) f.push('did not suggest "button"');
			return f;
		}
	},
	{
		label: 'internal component rejected as a direct target',
		run: () => {
			const f: string[] = [];
			initApp();
			const r = silk(['add', '_internal/overlay']);
			if (r.status === 0) f.push('expected non-zero exit');
			if (!r.out.includes('internal')) f.push('no "internal" explanation');
			return f;
		}
	},
	{
		label: 'add theme default resolves offline',
		run: () => {
			const f: string[] = [];
			initApp();
			const r = silk(['add', 'theme', 'default']);
			if (r.status !== 0) f.push(`add theme exited ${r.status}`);
			if (!exists(`${SILK}/theme.css`)) f.push('theme.css not written');
			else if (!read(`${SILK}/theme.css`).includes('@theme')) f.push('theme.css missing @theme');
			return f;
		}
	},
	{
		label: 'list shows components and themes',
		run: () => {
			const f: string[] = [];
			const r = silk(['list']);
			if (r.status !== 0) f.push(`list exited ${r.status}`);
			if (!r.out.includes('button')) f.push('list missing "button"');
			if (!r.out.includes('default')) f.push('list missing "default" theme');
			return f;
		}
	},
	{
		label: '--version matches package.json',
		run: () => {
			const f: string[] = [];
			const r = silk(['--version']);
			if (r.status !== 0) f.push(`--version exited ${r.status}`);
			if (r.out.trim() !== pkg.version) {
				f.push(`printed "${r.out.trim()}", expected ${pkg.version}`);
			}
			return f;
		}
	},
	{
		label: 'bare project reports missing peer dependencies',
		run: () => {
			const f: string[] = [];
			const r = initApp(true);
			if (r.status !== 0) f.push(`init exited ${r.status}`);
			if (!r.out.includes('missing peer dependencies')) f.push('no missing-peer warning');
			return f;
		}
	}
];

function verify(noBuild: boolean) {
	buildCli(noBuild);
	header('silk sandbox · verify');
	dim(`running ${CHECKS.length} checks against ${path.relative(cliRoot, appDir)}`);
	console.log();

	let failed = 0;
	for (const check of CHECKS) {
		const failures = check.run();
		if (failures.length === 0) {
			console.log(`  ${pc.green('✔')} ${check.label}`);
		} else {
			failed++;
			console.log(`  ${pc.red('✖')} ${check.label}`);
			for (const failure of failures) console.log(`    ${pc.red(failure)}`);
		}
	}

	console.log();
	if (failed > 0) {
		console.log(`  ${pc.red(`${failed} of ${CHECKS.length} checks failed`)}`);
		dim('reproduce a command with: bun run sandbox run <args>');
		process.exit(1);
	}
	console.log(`  ${pc.green(`all ${CHECKS.length} checks passed`)}`);
}

/** Runs one silk command against the persistent sandbox app, for debugging. */
function runOnce(silkArgs: string[], noBuild: boolean) {
	if (silkArgs.length === 0) {
		printHelp();
		process.exit(1);
	}
	buildCli(noBuild);
	ensureApp();
	process.exit(
		spawnSync('node', [distEntry, ...silkArgs], { cwd: appDir, stdio: 'inherit' }).status ?? 1
	);
}

function printHelp() {
	header('silk sandbox');
	console.log('  Run the local silk build against a throwaway project and verify it works.');
	console.log();
	console.log(
		`  ${pc.cyan('bun run sandbox')}                  run the full check suite (default)`
	);
	console.log(`  ${pc.cyan('bun run sandbox run <args>')}       run one silk command in the app`);
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
	case 'verify':
		verify(noBuild);
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
	case 'run':
		runOnce(args.slice(1), noBuild);
		break;
	default:
		runOnce(args, noBuild);
}
