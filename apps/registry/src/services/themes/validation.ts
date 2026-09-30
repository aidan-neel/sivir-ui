import { parseTheme, type Theme } from '@sivir-ui/svelte/themes/theme';

const TEXT_LIMITS = {
    slug: 80,
    name: 80,
    description: 500,
    publisher: 80,
    fontSans: 200,
    fontMono: 200,
    fontHeader: 200
} as const;

/**
 * Registry-served CSS is applied live on sivir.dev and written into projects by
 * the CLI, so community values may not load resources or escape their
 * declaration, even in forms `parseTheme` accepts.
 */
const UNSAFE_CSS_PATTERN =
    /[{};<>\\]|\/\*|\burl\s*\(|\bimage(?:-set)?\s*\(|\bsrc\s*\(|@import|\bexpression\s*\(/i;

export class ThemeValidationError extends Error {}

function assertLength(theme: Theme, field: keyof typeof TEXT_LIMITS) {
    const value = theme[field];
    if (typeof value !== 'string') {
        return;
    }

    if (value.length > TEXT_LIMITS[field]) {
        throw new ThemeValidationError(
            `Invalid theme: ${field} must be at most ${TEXT_LIMITS[field]} characters.`
        );
    }
}

function assertSafeCss(value: string, field: string) {
    if (UNSAFE_CSS_PATTERN.test(value)) {
        throw new ThemeValidationError(
            `Invalid theme: ${field} contains CSS the registry does not accept.`
        );
    }
}

function assertSafeCssMap(map: Record<string, string> | undefined, field: string) {
    if (!map) {
        return;
    }

    for (const [name, value] of Object.entries(map)) {
        assertSafeCss(value, `${field}.${name}`);
    }
}

function assertSafeTheme(theme: Theme) {
    assertSafeCss(theme.fontSans, 'fontSans');
    assertSafeCss(theme.fontMono, 'fontMono');
    assertSafeCss(theme.fontHeader, 'fontHeader');
    assertSafeCssMap(theme.foundation?.light, 'foundation.light');
    assertSafeCssMap(theme.foundation?.dark, 'foundation.dark');
    assertSafeCssMap(theme.tokens?.shared, 'tokens.shared');
    assertSafeCssMap(theme.tokens?.light, 'tokens.light');
    assertSafeCssMap(theme.tokens?.dark, 'tokens.dark');
}

/** Validates an untrusted publish payload against the theme contract and registry policy. */
export function parsePublishableTheme(input: unknown): Theme {
    let theme: Theme;
    try {
        theme = parseTheme(input);
    } catch (error) {
        throw new ThemeValidationError(error instanceof Error ? error.message : 'Invalid theme.');
    }

    for (const field of Object.keys(TEXT_LIMITS) as (keyof typeof TEXT_LIMITS)[]) {
        assertLength(theme, field);
    }

    assertSafeTheme(theme);

    return theme;
}
