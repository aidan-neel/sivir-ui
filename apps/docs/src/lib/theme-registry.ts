import type { Theme } from '@sivir-ui/svelte/themes/theme';

export const themeSources = ['sivir', 'community'] as const;

export type ThemeSource = (typeof themeSources)[number];

export type ThemeSourceFilter = 'all' | ThemeSource;

export type RegistryTheme = Theme & {
    id: string;
    source: ThemeSource;
    createdAt: string;
    updatedAt: string;
};

export type RegistryThemePage = {
    items: RegistryTheme[];
    total: number;
    limit: number;
    offset: number;
};

export type RegistryListOptions = {
    q?: string;
    source?: ThemeSourceFilter;
    limit?: number;
    offset?: number;
};

export type PublishedTheme = {
    theme: RegistryTheme;
    editToken: string;
};

export const THEMES_PAGE_SIZE = 24;

export const THEME_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function themeInstallCommand(slug: string): string {
    return `bunx @sivir-ui/svelte add theme ${slug}`;
}

export function themeStylesheetPath(slug: string): string {
    return `/themes/${slug}.css`;
}

/**
 * Raises `themeToCss` output by one element of specificity (`:root` → `html:root`,
 * `.dark` → `html.dark`) so a page-level preview wins over the stored live theme
 * regardless of stylesheet order, while keeping its own light/dark precedence.
 */
export function themePreviewCss(css: string): string {
    return css
        .split('\n')
        .map((line) => {
            if (line.startsWith('\t')) {
                return line;
            }

            return line.replace(/(^|,\s*)(:root|\.dark)/g, '$1html$2');
        })
        .join('\n');
}
