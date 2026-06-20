import { DEFAULT_THEME, type Theme } from './theme';

/** Plan 3: v2 only. Old presets (.ts files) deleted. */
export const themesV2: Theme[] = [DEFAULT_THEME];
export const defaultThemeV2: Theme = DEFAULT_THEME;

// Aliases for backward compat (if any old non-deleted consumer needs them)
export const defaultTheme = defaultThemeV2;
export const builtInThemePresets = themesV2;
