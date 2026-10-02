import { readFile, writeFile } from 'node:fs/promises';
import type { Theme } from '@sivir-ui/svelte/themes/theme';

const PRESETS_FILE = new URL(
    '../../../../../packages/sivir/src/themes/builtin-presets.ts',
    import.meta.url
);

const INDENT = '    ';

const CODE_TOKEN_KEYS = [
    'comment',
    'keyword',
    'string',
    'number',
    'function',
    'property',
    'builtin',
    'entity',
    'meta'
] as const;

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export class PresetSourceError extends Error {}

function quote(value: string): string {
    if (value.includes("'") && !value.includes('"')) {
        return `"${value.replaceAll('\\', '\\\\')}"`;
    }

    return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

function key(name: string): string {
    if (IDENTIFIER.test(name)) {
        return name;
    }

    return quote(name);
}

function block(lines: string[], depth: number): string {
    if (lines.length === 0) {
        return '{}';
    }

    const inner = INDENT.repeat(depth + 1);
    const outer = INDENT.repeat(depth);

    return `{\n${lines.map((line) => `${inner}${line}`).join(',\n')}\n${outer}}`;
}

function serialize(value: unknown, depth: number): string {
    if (typeof value === 'string') {
        return quote(value);
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    if (Array.isArray(value)) {
        const inner = INDENT.repeat(depth + 1);
        const items = value.map((item) => `${inner}${serialize(item, depth + 1)}`);

        return items.length === 0 ? '[]' : `[\n${items.join(',\n')}\n${INDENT.repeat(depth)}]`;
    }

    if (value !== null && typeof value === 'object') {
        const lines = Object.entries(value)
            .filter(([, entry]) => {
                return entry !== undefined;
            })
            .map(([name, entry]) => {
                return `${key(name)}: ${serialize(entry, depth + 1)}`;
            });

        return block(lines, depth);
    }

    throw new PresetSourceError(`Cannot write ${typeof value} into a preset.`);
}

function serializeTokenGroup(group: Record<string, string>, depth: number): string {
    const codeNames = CODE_TOKEN_KEYS.map((name) => `--color-code-${name}`);
    const hasCodePalette = codeNames.every((name) => group[name] !== undefined);

    if (!hasCodePalette) {
        return serialize(group, depth);
    }

    const lines = Object.entries(group)
        .filter(([name]) => {
            return !codeNames.includes(name);
        })
        .map(([name, entry]) => {
            return `${key(name)}: ${quote(entry)}`;
        });
    const palette = CODE_TOKEN_KEYS.map((name) => {
        return `${key(name)}: ${quote(group[`--color-code-${name}`])}`;
    });

    lines.push(`...codeTokens(${block(palette, depth + 1)})`);

    return block(lines, depth);
}

function serializeTheme(theme: Theme): string {
    const lines = Object.entries(theme)
        .filter(([, entry]) => {
            return entry !== undefined;
        })
        .map(([name, entry]) => {
            if (name === 'version') {
                return 'version: THEME_VERSION';
            }

            if (name === 'tokens' && entry !== null && typeof entry === 'object') {
                const groups = Object.entries(entry as Record<string, Record<string, string>>)
                    .filter(([, group]) => {
                        return group !== undefined;
                    })
                    .map(([groupName, group]) => {
                        return `${key(groupName)}: ${serializeTokenGroup(group, 2)}`;
                    });

                return `tokens: ${block(groups, 1)}`;
            }

            return `${key(name)}: ${serialize(entry, 1)}`;
        });

    return block(lines, 0);
}

function matchingBrace(source: string, open: number): number {
    let depth = 0;
    let quoteChar: string | null = null;

    for (let index = open; index < source.length; index++) {
        const char = source[index];

        if (quoteChar) {
            if (char === '\\') {
                index++;
            } else if (char === quoteChar) {
                quoteChar = null;
            }

            continue;
        }

        if (char === "'" || char === '"' || char === '`') {
            quoteChar = char;
        } else if (char === '{') {
            depth++;
        } else if (char === '}') {
            depth--;

            if (depth === 0) {
                return index;
            }
        }
    }

    throw new PresetSourceError('Unbalanced braces in builtin-presets.ts.');
}

/** Rewrites the literal for an existing built-in preset in the package source. Dev only. */
export async function savePresetSource(theme: Theme): Promise<void> {
    const source = await readFile(PRESETS_FILE, 'utf8');
    const declaration = /export const \w+: Theme = \{/g;

    for (const match of source.matchAll(declaration)) {
        const open = match.index + match[0].length - 1;
        const close = matchingBrace(source, open);
        const literal = source.slice(open, close + 1);

        if (!literal.includes(`slug: ${quote(theme.slug)}`)) {
            continue;
        }

        const next = `${source.slice(0, open)}${serializeTheme(theme)}${source.slice(close + 1)}`;

        await writeFile(PRESETS_FILE, next);

        return;
    }

    throw new PresetSourceError(`No preset with slug "${theme.slug}" in builtin-presets.ts.`);
}
