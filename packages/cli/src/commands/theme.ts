import * as clack from '@clack/prompts';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';
import { themeToCss, type ThemeDraft } from '../../../silk/src/themes/presets';
import { CONFIG_FILE, loadConfig } from '../config';
import { loadRegistryThemes } from '../registry';
import { fail, ok } from '../utils/ui';

export type ThemeOptions = {
	cwd: string;
};

/** True when a theme source is an absolute http(s) URL rather than a slug. */
export function looksLikeUrl(source: string) {
	return /^https?:\/\//i.test(source.trim());
}

/**
 * Turns a fetched theme response into CSS. Endpoints may serve either a
 * `ThemeDraft` JSON document (rendered with `themeToCss`) or ready-made CSS.
 * The format is decided by content-type, falling back to sniffing the body
 * (a leading `{` means JSON).
 */
export function themeCssFromResponse(body: string, contentType: string) {
	const isJson = /\bjson\b/i.test(contentType) || body.trimStart().startsWith('{');
	if (!isJson) return body;
	let draft: ThemeDraft;
	try {
		draft = JSON.parse(body) as ThemeDraft;
	} catch {
		throw new Error('theme source returned invalid JSON');
	}
	return themeToCss(draft);
}

/** Fetches and renders a theme served at an explicit URL. */
async function resolveThemeFromUrl(url: string) {
	let response: Response;
	try {
		response = await fetch(url);
	} catch {
		throw new Error(`theme source unreachable at ${url}`);
	}
	if (!response.ok) {
		throw new Error(`theme source responded ${response.status} for ${url}`);
	}
	const body = await response.text();
	const css = themeCssFromResponse(body, response.headers.get('content-type') ?? '');
	return { css, source: url };
}

/**
 * Resolves a theme source to CSS. A `http(s)` URL is fetched directly;
 * otherwise the value is treated as a slug -- built-in presets first, then
 * the configured registry.
 */
async function resolveThemeCss(source: string, registry: string) {
	if (looksLikeUrl(source)) return resolveThemeFromUrl(source.trim());

	const builtin = (await loadRegistryThemes()).find((theme) => theme.slug === source);
	if (builtin) return { css: builtin.css, source: 'built-in preset' };

	const url = `${registry.replace(/\/+$/, '')}/themes/${source}`;
	let response: Response;
	try {
		response = await fetch(url);
	} catch {
		throw new Error(`theme registry unreachable at ${url}`);
	}
	if (response.status === 404) {
		throw new Error(`no theme "${source}" in the registry -- browse https://silk-ui.dev/themes`);
	}
	if (!response.ok) {
		throw new Error(`theme registry responded ${response.status} for ${url}`);
	}
	const draft = (await response.json()) as ThemeDraft;
	return { css: themeToCss(draft), source: 'registry' };
}

/** Installs a theme by slug, registry lookup, or explicit URL. */
export async function addTheme(source: string, options: ThemeOptions) {
	const { cwd } = options;

	const config = await loadConfig(cwd);
	if (!config) {
		fail(`no ${CONFIG_FILE} found -- run ${pc.cyan('silk init')} first.`);
		process.exitCode = 1;
		return;
	}

	clack.intro(pc.bgMagenta(pc.black(' silk theme install ')));
	const spinner = clack.spinner();
	spinner.start(`Resolving theme ${pc.cyan(source)}`);

	let resolved;
	try {
		resolved = await resolveThemeCss(source, config.registry);
	} catch (error) {
		spinner.stop('Theme resolution failed', 1);
		fail(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
		return;
	}

	const target = path.join(cwd, config.dir, 'theme.css');
	await mkdir(path.dirname(target), { recursive: true });
	await writeFile(target, `/* silk theme: ${source} */\n${resolved.css}\n`);
	spinner.stop(`Fetched ${pc.cyan(source)} (${resolved.source})`);

	ok(`wrote ${pc.cyan(path.join(config.dir, 'theme.css'))}`);
	console.log(`  import it ${pc.bold('after')} ${pc.cyan(`${config.dir}/ui.css`)} so it wins.`);
	clack.outro('Theme installed.');
}
