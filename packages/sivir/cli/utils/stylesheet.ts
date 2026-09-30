import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/** Root stylesheets written by `sv add tailwindcss`, newest template first. */
export const STYLESHEET_CANDIDATES = ['src/routes/layout.css', 'src/app.css'];

const TAILWIND_IMPORT = /^@import\s+(['"])tailwindcss\1\s*;?[ \t]*$/m;

export type StylesheetPlan =
    | {
          status: 'imported';
          file: string;
      }
    | {
          status: 'replace';
          file: string;
          statement: string;
      }
    | {
          status: 'unknown';
      };

/** Relative specifier that loads `<dir>/ui.css` from a stylesheet at `file`. */
export function uiCssSpecifier(file: string, dir: string) {
    const relative = path.posix.relative(path.posix.dirname(file), path.posix.join(dir, 'ui.css'));

    return relative.startsWith('.') ? relative : `./${relative}`;
}

/**
 * Finds the root stylesheet that should load Sivir. `ui.css` already imports
 * Tailwind, so the plan replaces a bare `@import 'tailwindcss';` rather than
 * adding a second import. Anything ambiguous is left to the user.
 */
export async function planStylesheet(cwd: string, dir: string): Promise<StylesheetPlan> {
    const replaceable: { file: string; statement: string }[] = [];

    for (const file of STYLESHEET_CANDIDATES) {
        const absolute = path.join(cwd, file);
        if (!existsSync(absolute)) {
            continue;
        }

        const source = await readFile(absolute, 'utf8');
        const specifier = uiCssSpecifier(file, dir);
        if (source.includes(`'${specifier}'`) || source.includes(`"${specifier}"`)) {
            return {
                status: 'imported',
                file
            };
        }
        if (TAILWIND_IMPORT.test(source)) {
            replaceable.push({
                file,
                statement: `@import '${specifier}';`
            });
        }
    }

    if (replaceable.length !== 1) {
        return {
            status: 'unknown'
        };
    }

    return {
        status: 'replace',
        ...replaceable[0]
    };
}

export async function applyStylesheet(cwd: string, file: string, statement: string) {
    const absolute = path.join(cwd, file);
    const source = await readFile(absolute, 'utf8');

    await writeFile(absolute, source.replace(TAILWIND_IMPORT, statement));
}
