import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import {
	ResolveError,
	installableFiles,
	loadRegistryIndex,
	loadRegistryThemes,
	registryFilePath,
	resolveInstallPlan,
	rewriteImports,
	suggestComponent
} from './registry';
import type { RegistryComponent, RegistryIndex } from './types';

function component(overrides: Partial<RegistryComponent>): RegistryComponent {
	return {
		name: 'button',
		version: '1.0.0',
		visibility: 'public',
		files: [],
		components: [],
		shared: [],
		sharedFiles: [],
		peerDependencies: {},
		...overrides
	};
}

function index(components: RegistryComponent[]): RegistryIndex {
	return { cliVersion: '0.0.0', builtAt: 'test', components };
}

describe('resolveInstallPlan', () => {
	const fixture = index([
		component({ name: 'button', peerDependencies: { svelte: '^5.0.0', clsx: '^2.0.0' } }),
		component({ name: 'popover', components: ['button'] }),
		component({
			name: 'command',
			components: ['popover', 'button'],
			peerDependencies: { 'fuse.js': '^7.0.0' }
		}),
		component({ name: '_internal/overlay', visibility: 'internal' }),
		component({ name: 'modal', components: ['button', '_internal/overlay'] })
	]);

	test('resolves transitive dependencies once', () => {
		const plan = resolveInstallPlan(fixture, ['command']);
		expect(plan.components.map((c) => c.name)).toEqual(['command', 'popover', 'button']);
	});

	test('pulls internal components as dependencies', () => {
		const plan = resolveInstallPlan(fixture, ['modal']);
		expect(plan.components.map((c) => c.name)).toContain('_internal/overlay');
	});

	test('rejects internal components as direct targets', () => {
		expect(() => resolveInstallPlan(fixture, ['_internal/overlay'])).toThrow(ResolveError);
	});

	test('rejects unknown components with a suggestion', () => {
		expect(() => resolveInstallPlan(fixture, ['bttn'])).toThrow('did you mean "button"');
	});

	test('unions peer dependencies across the plan', () => {
		const plan = resolveInstallPlan(fixture, ['command']);
		expect(Object.keys(plan.peerDependencies).sort()).toEqual(['clsx', 'fuse.js', 'svelte']);
	});
});

describe('suggestComponent', () => {
	const fixture = index([
		component({ name: 'button' }),
		component({ name: '_internal/overlay', visibility: 'internal' })
	]);

	test('never suggests internal components', () => {
		expect(suggestComponent(fixture, 'overlay')).toBeNull();
	});

	test('suggests close public names', () => {
		expect(suggestComponent(fixture, 'buton')).toBe('button');
	});
});

describe('installableFiles', () => {
	test('excludes manifest.ts', () => {
		const files = installableFiles(
			component({
				files: ['components/button/button.svelte', 'components/button/manifest.ts']
			})
		);
		expect(files).toEqual(['components/button/button.svelte']);
	});
});

describe('rewriteImports', () => {
	test('rewrites subpath and bare imports', () => {
		const source = [
			"import { cn } from '@silk/ui/utils';",
			"import { states } from '@silk/ui/internals/state.svelte.ts';",
			"import Button from '@silk/ui';"
		].join('\n');
		expect(rewriteImports(source, '$lib/silk')).toBe(
			[
				"import { cn } from '$lib/silk/utils';",
				"import { states } from '$lib/silk/internals/state.svelte.ts';",
				"import Button from '$lib/silk';"
			].join('\n')
		);
	});

	test('leaves unrelated imports alone', () => {
		const source = "import Search from '@lucide/svelte/icons/search';";
		expect(rewriteImports(source, '$lib/silk')).toBe(source);
	});
});

describe('registry snapshot', () => {
	test('index loads and every referenced file exists', async () => {
		const snapshot = await loadRegistryIndex();
		expect(snapshot.components.length).toBeGreaterThan(30);
		for (const entry of snapshot.components) {
			for (const file of [...installableFiles(entry), ...entry.sharedFiles]) {
				expect(existsSync(registryFilePath(file))).toBe(true);
			}
		}
	});

	test('every dependency resolves against the index', async () => {
		const snapshot = await loadRegistryIndex();
		const publicNames = snapshot.components
			.filter((c) => c.visibility === 'public')
			.map((c) => c.name);
		const plan = resolveInstallPlan(snapshot, publicNames);
		expect(plan.components.length).toBe(snapshot.components.length);
	});

	test('built-in themes carry rendered css', async () => {
		const themes = await loadRegistryThemes();
		expect(themes.length).toBeGreaterThan(0);
		for (const theme of themes) {
			expect(theme.css).toContain('@theme {');
			expect(theme.css).toContain('.dark {');
		}
	});
});
