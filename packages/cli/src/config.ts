import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import type { SilkConfig } from './types';

export const CONFIG_FILE = 'silk.json';

export const DEFAULT_CONFIG: SilkConfig = {
	dir: 'src/lib/silk',
	alias: '$lib/silk',
	registry: 'https://silk-ui.dev/api',
	components: {}
};

export function configPath(cwd: string) {
	return path.join(cwd, CONFIG_FILE);
}

/** Reads silk.json from the project root, or null when not initialized. */
export async function loadConfig(cwd: string): Promise<SilkConfig | null> {
	const file = configPath(cwd);
	if (!existsSync(file)) return null;
	const parsed = JSON.parse(await readFile(file, 'utf8')) as Partial<SilkConfig>;
	return { ...DEFAULT_CONFIG, ...parsed, components: parsed.components ?? {} };
}

export async function saveConfig(cwd: string, config: SilkConfig) {
	await writeFile(configPath(cwd), JSON.stringify(config, null, '\t') + '\n');
}
