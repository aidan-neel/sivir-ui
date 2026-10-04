import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as clack from '@clack/prompts';
import pc from 'picocolors';
import { sivirTheme } from '../../src/themes/builtin-presets';
import { themeToCss } from '../../src/themes/theme';
import { CONFIG_FILE, DEFAULT_CONFIG, loadConfig, saveConfig } from '../config';
import { BASE_PEER_DEPENDENCIES, loadRegistryIndex } from '../registry';
import { installFile, installMissingDependencies } from '../utils/project';
import { applyStylesheet, planStylesheet } from '../utils/stylesheet';
import { ok, warn } from '../utils/ui';

export type InitOptions = {
    cwd: string;
    yes: boolean;
};

/** Shared files every sivir project needs before any component lands. */
export async function baseFiles() {
    const index = await loadRegistryIndex();
    const files = new Set<string>(['ui.css']);
    for (const component of index.components) {
        for (const file of component.sharedFiles) {
            files.add(file);
        }
    }
    return [...files].sort();
}

/**
 * Writes the Sivir theme next to `ui.css` for new projects. `ui.css` keeps the
 * original defaults, so existing installs never change. An existing
 * `theme.css` is left alone.
 */
async function writeDefaultTheme(cwd: string, dir: string) {
    const target = path.join(cwd, dir, 'theme.css');
    if (existsSync(target)) {
        return;
    }

    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `/* sivir theme: ${sivirTheme.slug} */\n${themeToCss(sivirTheme)}\n`);
}

/**
 * Points the root stylesheet at `ui.css`, which already includes Tailwind, or
 * explains how to when the stylesheet is not one `sv add tailwindcss` writes.
 */
async function wireStylesheet(cwd: string, dir: string, yes: boolean) {
    const plan = await planStylesheet(cwd, dir);
    const uiCss = pc.cyan(`${dir}/ui.css`);
    const themeCss = pc.cyan(`${dir}/theme.css`);
    const tailwindImport = pc.cyan("@import 'tailwindcss';");

    if (plan.status === 'imported') {
        ok(`${pc.cyan(plan.file)} already imports ${uiCss}.`);
        warn(`import ${themeCss} after ${uiCss} to apply the Sivir theme`);
        return;
    }
    if (plan.status === 'unknown') {
        warn(
            `import ${uiCss} in your root stylesheet, in place of ${tailwindImport}, then import ${themeCss} after it`
        );
        return;
    }

    const statement = `${plan.statement}\n${plan.statement.replace('ui.css', 'theme.css')}`;
    let apply = yes;
    if (!yes && process.stdout.isTTY) {
        const answer = await clack.confirm({
            message: `Replace ${tailwindImport} in ${pc.cyan(plan.file)} with ${pc.cyan(plan.statement)}? (ui.css includes Tailwind)`
        });
        apply = answer === true;
    }
    if (!apply) {
        warn(
            `replace ${tailwindImport} in ${pc.cyan(plan.file)} with ${pc.cyan(plan.statement)}, then import ${themeCss} after it`
        );
        return;
    }

    await applyStylesheet(cwd, plan.file, statement);
    ok(`${pc.cyan(plan.file)} now imports ${uiCss} and ${themeCss}.`);
}

export async function init(options: InitOptions) {
    const { cwd, yes } = options;

    clack.intro(pc.bgMagenta(pc.black(' sivir init ')));

    if (await loadConfig(cwd)) {
        clack.outro(
            `${CONFIG_FILE} already exists -- run ${pc.cyan('sivir add <component>')} instead.`
        );
        return;
    }

    const isSvelte =
        existsSync(path.join(cwd, 'svelte.config.js')) ||
        existsSync(path.join(cwd, 'svelte.config.ts')) ||
        (existsSync(path.join(cwd, 'src', 'routes')) &&
            existsSync(path.join(cwd, 'vite.config.ts')));
    if (!isSvelte) {
        warn(`no svelte.config.js found in ${cwd} -- sivir targets Svelte 5 + SvelteKit projects.`);
    }

    let dir = DEFAULT_CONFIG.dir;
    let alias = DEFAULT_CONFIG.alias;
    if (!yes) {
        const dirAnswer = await clack.text({
            message: 'Where should sivir components live?',
            defaultValue: DEFAULT_CONFIG.dir,
            placeholder: DEFAULT_CONFIG.dir
        });
        if (clack.isCancel(dirAnswer)) {
            clack.cancel('init cancelled.');
            return;
        }
        dir = dirAnswer || DEFAULT_CONFIG.dir;

        const aliasAnswer = await clack.text({
            message: 'Import alias for that directory?',
            defaultValue: DEFAULT_CONFIG.alias,
            placeholder: DEFAULT_CONFIG.alias
        });
        if (clack.isCancel(aliasAnswer)) {
            clack.cancel('init cancelled.');
            return;
        }
        alias = aliasAnswer || DEFAULT_CONFIG.alias;
    }

    const config = { ...DEFAULT_CONFIG, dir, alias, components: {} };

    const spinner = clack.spinner();
    spinner.start('Installing theme tokens and shared utilities');
    for (const file of await baseFiles()) {
        await installFile(cwd, dir, file, alias, false);
    }
    await writeDefaultTheme(cwd, dir);
    await saveConfig(cwd, config);
    spinner.stop(
        `Installed ${pc.cyan(`${dir}/ui.css`)}, ${pc.cyan(`${dir}/theme.css`)}, utils, shared modules, and ${CONFIG_FILE}`
    );

    await installMissingDependencies(cwd, BASE_PEER_DEPENDENCIES, yes);
    await wireStylesheet(cwd, dir, yes);
    clack.outro(
        `Ready -- run ${pc.cyan('sivir add button')} to install a component, or ${pc.cyan("sivir add '*'")} for all components.`
    );
}
