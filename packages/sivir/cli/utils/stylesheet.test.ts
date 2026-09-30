import { afterEach, describe, expect, test } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { planStylesheet, uiCssSpecifier } from './stylesheet';

const tempDirs: string[] = [];

async function projectWith(files: Record<string, string>) {
    const cwd = await mkdtemp(path.join(tmpdir(), 'sivir-stylesheet-'));
    tempDirs.push(cwd);
    for (const [file, source] of Object.entries(files)) {
        await mkdir(path.dirname(path.join(cwd, file)), { recursive: true });
        await writeFile(path.join(cwd, file), source);
    }
    return cwd;
}

afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('uiCssSpecifier', () => {
    test('resolves ui.css relative to the stylesheet', () => {
        expect(uiCssSpecifier('src/app.css', 'src/lib/sivir')).toBe('./lib/sivir/ui.css');
        expect(uiCssSpecifier('src/routes/layout.css', 'src/lib/sivir')).toBe(
            '../lib/sivir/ui.css'
        );
    });
});

describe('planStylesheet', () => {
    test('replaces a bare Tailwind import in the sv layout stylesheet', async () => {
        const cwd = await projectWith({
            'src/routes/layout.css': '@import "tailwindcss";\n'
        });

        expect(await planStylesheet(cwd, 'src/lib/sivir')).toEqual({
            status: 'replace',
            file: 'src/routes/layout.css',
            statement: "@import '../lib/sivir/ui.css';"
        });
    });

    test('recognizes an existing ui.css import in either quote style', async () => {
        const cwd = await projectWith({
            'src/app.css': '@import "./lib/sivir/ui.css";\n'
        });

        expect(await planStylesheet(cwd, 'src/lib/sivir')).toEqual({
            status: 'imported',
            file: 'src/app.css'
        });
    });

    test('leaves customized Tailwind imports to the user', async () => {
        const cwd = await projectWith({
            'src/app.css': "@import 'tailwindcss' source('../lib');\n"
        });

        expect(await planStylesheet(cwd, 'src/lib/sivir')).toEqual({
            status: 'unknown'
        });
    });
});
