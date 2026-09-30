import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
import type { Theme } from '@sivir-ui/svelte/themes/theme';
import type { RegistryThemeRecord } from './model';

const BUILT_IN_TIMESTAMP = '2026-07-14T00:00:00.000Z';

export const builtInThemes: readonly Theme[] = builtInThemePresets;

const builtInSlugs: ReadonlySet<string> = new Set(builtInThemes.map((theme) => theme.slug));

export function isBuiltInSlug(slug: string): boolean {
    return builtInSlugs.has(slug);
}

export function findBuiltInTheme(slug: string): Theme | undefined {
    return builtInThemes.find((theme) => theme.slug === slug);
}

export function builtInRecord(theme: Theme): RegistryThemeRecord {
    return {
        ...theme,
        id: `sivir:${theme.slug}`,
        source: 'sivir',
        createdAt: BUILT_IN_TIMESTAMP,
        updatedAt: BUILT_IN_TIMESTAMP
    };
}
