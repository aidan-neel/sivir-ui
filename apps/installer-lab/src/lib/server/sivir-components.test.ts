import { describe, expect, test } from 'vitest';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

describe('launcher component usage', () => {
	test('declares Sivir and uses Sivir primitives for its controls and surfaces', async () => {
		const appRoot = path.resolve(import.meta.dirname, '../../..');
		const packageJson = JSON.parse(await readFile(path.join(appRoot, 'package.json'), 'utf8')) as {
			dependencies?: Record<string, string>;
		};
		expect(packageJson.dependencies?.['@sivir/ui']).toBe('workspace:*');

		const page = await readFile(path.join(appRoot, 'src', 'routes', '+page.svelte'), 'utf8');
		expect(page).toContain("from '@sivir/ui/brand-mark'");
		expect(page).toContain("from '@sivir/ui/components/card'");
		expect(page).not.toMatch(/<(?:button|input|textarea|select)\b/);
	});
});
