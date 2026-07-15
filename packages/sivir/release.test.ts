import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';

import packageJson from './package.json';

describe('publishable package contract', () => {
	test('declares the public package metadata used by npm', () => {
		expect(packageJson.repository).toEqual({
			type: 'git',
			url: 'git+https://github.com/aidan-neel/sivir-ui.git',
			directory: 'packages/sivir'
		});
		expect(packageJson.homepage).toBe('https://github.com/aidan-neel/sivir-ui#readme');
		expect(packageJson.bugs).toBe('https://github.com/aidan-neel/sivir-ui/issues');
		expect(packageJson.keywords).toEqual(
			expect.arrayContaining(['svelte', 'components', 'ui', 'tailwind'])
		);
	});

	test('keeps distributable CSS within the public-token budget', async () => {
		const css = await readFile(new URL('./src/ui.css', import.meta.url), 'utf8');
		const privatePrefix =
			/^\s*--(?:button|badge|field|panel|card|menu|command|tooltip|switch|checkbox|toast|tabs|progress|modal|sheet|textarea|breadcrumb|toggle|shortcut|slider)-/m;

		expect(css.split('\n').length).toBeLessThanOrEqual(175);
		expect(Buffer.byteLength(css)).toBeLessThanOrEqual(8 * 1024);
		expect(css).not.toMatch(privatePrefix);
		expect(css).not.toMatch(/(^|})\s*\*\s*\{/);
		expect(css).not.toContain('@layer base');
	});

	test('keeps component animations colocated and reduced-motion safe', async () => {
		const animationFiles = [
			'./src/components/skeleton/skeleton.svelte',
			'./src/components/progress/progress.svelte',
			'./src/components/toast/toast.svelte',
			'./src/components/marquee/marquee.svelte'
		] as const;
		const source = (
			await Promise.all(
				animationFiles.map((file) => readFile(new URL(file, import.meta.url), 'utf8'))
			)
		).join('\n');

		for (const name of [
			'skeleton-loading',
			'sivir-progress-slide',
			'sivir-toast-progress',
			'sivir-marquee-x',
			'sivir-marquee-y'
		]) {
			expect(source).toContain(`@keyframes ${name}`);
			expect(source.split(name)).toHaveLength(3);
		}
		for (const file of animationFiles) {
			const component = await readFile(new URL(file, import.meta.url), 'utf8');
			expect(component).toContain('motion-reduce:animate-none');
		}
	});

	test('does not ship redundant styling runtimes', async () => {
		const tooltip = await readFile(
			new URL('./src/components/tooltip/shared-tooltip.ts', import.meta.url),
			'utf8'
		);

		expect(tooltip).not.toContain('slot-text/style.css');
		expect(packageJson.dependencies).not.toHaveProperty('slot-text');
		expect(packageJson.dependencies).not.toHaveProperty('tailwind-merge');
	});

	test('ships the repository license byte-for-byte', async () => {
		const [rootLicense, packageLicense] = await Promise.all([
			readFile(new URL('../../LICENSE', import.meta.url), 'utf8'),
			readFile(new URL('./LICENSE', import.meta.url), 'utf8')
		]);

		expect(packageLicense).toBe(rootLicense);
		expect(packageLicense).not.toContain('Copyright (c) 2025 Name');
	});

	test('exports every documented single-element component from the public barrel', async () => {
		const barrel = await readFile(new URL('./src/index.ts', import.meta.url), 'utf8');

		expect(barrel).toContain("export { Panel } from './components/panel';");
		expect(barrel).toContain("export { Separator } from './components/separator';");
	});
});
