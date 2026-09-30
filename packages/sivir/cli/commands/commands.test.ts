import { afterEach, describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { DEFAULT_THEME } from '../../src/themes/theme';
import { DEFAULT_CONFIG, loadConfig, saveConfig } from '../config';
import { add } from './add';
import { init } from './init';
import { addTheme } from './theme';

const tempDirs: string[] = [];
const originalFetch = globalThis.fetch;

async function tempProject() {
    const cwd = await mkdtemp(path.join(tmpdir(), 'sivir-command-'));
    tempDirs.push(cwd);
    await writeFile(path.join(cwd, 'svelte.config.js'), 'export default {};\n');
    await writeFile(
        path.join(cwd, 'package.json'),
        JSON.stringify({
            private: true,
            dependencies: {
                svelte: '^5.0.0',
                tailwindcss: '^4.0.0',
                cnfast: '^0.0.8',
                '@floating-ui/dom': '^1.0.0',
                '@fontsource/inter': '^5.0.0',
                '@fontsource/jetbrains-mono': '^5.0.0',
                '@lucide/svelte': '^1.0.0',
                'tailwind-variants': '^3.0.0',
                'fuse.js': '^7.0.0'
            }
        })
    );
    return cwd;
}

async function initializedProject() {
    const cwd = await tempProject();
    await init({ cwd, yes: true });
    return cwd;
}

afterEach(async () => {
    globalThis.fetch = originalFetch;
    process.exitCode = 0;
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('init command', () => {
    test('creates the default config and base files non-interactively', async () => {
        const cwd = await tempProject();
        await init({ cwd, yes: true });

        expect(await loadConfig(cwd)).toEqual(DEFAULT_CONFIG);
        expect(existsSync(path.join(cwd, DEFAULT_CONFIG.dir, 'ui.css'))).toBe(true);
        expect(existsSync(path.join(cwd, DEFAULT_CONFIG.dir, 'utils.ts'))).toBe(true);
    });

    test('points the sv root stylesheet at ui.css instead of a second Tailwind import', async () => {
        const cwd = await tempProject();
        const stylesheet = path.join(cwd, 'src/routes/layout.css');
        await mkdir(path.dirname(stylesheet), { recursive: true });
        await writeFile(stylesheet, "@import 'tailwindcss';\n@plugin '@tailwindcss/typography';\n");

        await init({ cwd, yes: true });

        expect(await readFile(stylesheet, 'utf8')).toBe(
            "@import '../lib/sivir/ui.css';\n@plugin '@tailwindcss/typography';\n"
        );
    });

    test('never creates a package.json to install dependencies into', async () => {
        const cwd = await mkdtemp(path.join(tmpdir(), 'sivir-command-'));
        tempDirs.push(cwd);

        await init({ cwd, yes: true });

        expect(existsSync(path.join(cwd, 'package.json'))).toBe(false);
    });

    test('leaves stylesheets alone when the root stylesheet is ambiguous', async () => {
        const cwd = await tempProject();
        const appCss = path.join(cwd, 'src/app.css');
        const layoutCss = path.join(cwd, 'src/routes/layout.css');
        await mkdir(path.dirname(layoutCss), { recursive: true });
        await writeFile(appCss, "@import 'tailwindcss';\n");
        await writeFile(layoutCss, "@import 'tailwindcss';\n");

        await init({ cwd, yes: true });

        expect(await readFile(appCss, 'utf8')).toBe("@import 'tailwindcss';\n");
        expect(await readFile(layoutCss, 'utf8')).toBe("@import 'tailwindcss';\n");
    });
});

describe('add command', () => {
    test('installs and records a component with rewritten imports', async () => {
        const cwd = await initializedProject();
        await add(['button'], { cwd, yes: false, overwrite: false });

        const source = await readFile(
            path.join(cwd, DEFAULT_CONFIG.dir, 'components/button/button.svelte'),
            'utf8'
        );
        const config = await loadConfig(cwd);
        expect(source).toContain('$lib/sivir');
        expect(source).not.toContain('@sivir-ui/svelte');
        expect(config?.components.button).toMatch(/^\d+\.\d+\.\d+$/);
    });

    test('preserves consumer files unless overwrite is requested', async () => {
        const cwd = await initializedProject();
        const target = path.join(cwd, DEFAULT_CONFIG.dir, 'components/button/button.svelte');
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, '// consumer-owned\n');

        await add(['button'], { cwd, yes: false, overwrite: false });
        expect(await readFile(target, 'utf8')).toBe('// consumer-owned\n');
    });

    test('does not report shared files from init as conflicts', async () => {
        const cwd = await initializedProject();
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args: unknown[]) => {
            logs.push(args.join(' '));
        };

        try {
            await add(['button', 'modal'], { cwd, yes: false, overwrite: false });
        } finally {
            console.log = originalLog;
        }

        expect(logs.some((line) => line.includes('differ from the registry'))).toBe(false);
        expect(logs.filter((line) => line.endsWith(' utils.ts'))).toHaveLength(1);
    });

    test('rejects unknown components without writing component files', async () => {
        const cwd = await initializedProject();
        await add(['buttom'], { cwd, yes: false, overwrite: false });

        expect(process.exitCode).toBe(1);
        expect(existsSync(path.join(cwd, DEFAULT_CONFIG.dir, 'components/button'))).toBe(false);
        expect((await loadConfig(cwd))?.components).toEqual({});
    });
});

describe('theme command', () => {
    test('writes a bundled preset without network access', async () => {
        const cwd = await initializedProject();
        await addTheme('default', { cwd });

        const css = await readFile(path.join(cwd, DEFAULT_CONFIG.dir, 'theme.css'), 'utf8');
        expect(css).toStartWith('/* sivir theme: default */');
        expect(css).toContain(':root');
    });

    test('writes a validated remote v2 theme', async () => {
        const cwd = await initializedProject();
        await saveConfig(cwd, { ...DEFAULT_CONFIG, registry: 'https://registry.example' });
        globalThis.fetch = (() =>
            Promise.resolve(
                new Response(JSON.stringify({ ...DEFAULT_THEME, slug: 'remote', brand: '#0066cc' }))
            )) as unknown as typeof fetch;

        await addTheme('remote', { cwd });
        const css = await readFile(path.join(cwd, DEFAULT_CONFIG.dir, 'theme.css'), 'utf8');
        expect(css).toStartWith('/* sivir theme: remote */');
        expect(css).toContain('--color-primary: #0066cc');
    });

    test('reports registry failures without writing theme.css', async () => {
        const cwd = await initializedProject();
        await saveConfig(cwd, { ...DEFAULT_CONFIG, registry: 'https://registry.example' });
        globalThis.fetch = (() =>
            Promise.resolve(new Response(null, { status: 404 }))) as unknown as typeof fetch;

        await addTheme('missing', { cwd });
        expect(process.exitCode).toBe(1);
        expect(existsSync(path.join(cwd, DEFAULT_CONFIG.dir, 'theme.css'))).toBe(false);
    });

    test('reports network failures without writing theme.css', async () => {
        const cwd = await initializedProject();
        await saveConfig(cwd, { ...DEFAULT_CONFIG, registry: 'https://registry.example' });
        globalThis.fetch = (() => Promise.reject(new Error('offline'))) as unknown as typeof fetch;

        await addTheme('remote', { cwd });
        expect(process.exitCode).toBe(1);
        expect(existsSync(path.join(cwd, DEFAULT_CONFIG.dir, 'theme.css'))).toBe(false);
    });
});
