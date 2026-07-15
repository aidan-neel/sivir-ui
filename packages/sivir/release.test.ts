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
