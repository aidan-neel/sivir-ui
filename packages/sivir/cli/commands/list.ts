import pc from 'picocolors';
import { loadRegistryIndex, loadRegistryThemes } from '../registry';
import type { RegistryComponent, RegistryTheme } from '../types';

const VERSION_WIDTH = 7;
const MIN_DESCRIPTION_WIDTH = 20;
/** Leading indent, the version column, and the gutters between columns. */
const COLUMN_CHROME = VERSION_WIDTH + 7;
const FALLBACK_COLUMNS = 100;

function truncate(text: string, width: number) {
    return text.length <= width ? text : `${text.slice(0, Math.max(width - 1, 0))}…`;
}

function plural(count: number, noun: string) {
    return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

/**
 * Renders the `sivir list` output. Components and themes share one label
 * column so both sections line up, and the description column absorbs
 * whatever terminal width is left over.
 */
export function formatList(
    components: RegistryComponent[],
    themes: RegistryTheme[],
    columns = process.stdout.columns || FALLBACK_COLUMNS
): string[] {
    const labels = [...components.map((c) => c.name), ...themes.map((t) => t.slug)];
    const labelWidth = Math.max(0, ...labels.map((label) => label.length));
    const descriptionWidth = Math.max(columns - labelWidth - COLUMN_CHROME, MIN_DESCRIPTION_WIDTH);

    const lines = ['', `  ${pc.bold(plural(components.length, 'component'))}`, ''];
    for (const component of components) {
        const version = pc.dim(`v${component.version}`.padEnd(VERSION_WIDTH));
        const description = pc.dim(truncate(component.description ?? '', descriptionWidth));
        lines.push(`  ${pc.cyan(component.name.padEnd(labelWidth))}  ${version} ${description}`);
    }

    if (themes.length > 0) {
        lines.push('', `  ${pc.bold(plural(themes.length, 'built-in theme'))}`, '');
        for (const theme of themes) {
            lines.push(`  ${pc.magenta(theme.slug.padEnd(labelWidth))}  ${pc.dim(theme.name)}`);
        }
    }

    lines.push('', `  ${pc.dim('install with')} ${pc.cyan('sivir add <component>')}`, '');
    return lines;
}

export async function list() {
    const index = await loadRegistryIndex();
    const components = index.components
        .filter((component) => component.visibility === 'public')
        .sort((a, b) => a.name.localeCompare(b.name));
    const themes = await loadRegistryThemes();

    for (const line of formatList(components, themes)) console.log(line);
}
