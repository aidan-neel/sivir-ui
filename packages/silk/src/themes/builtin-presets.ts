import type { ThemeDraft } from '@silk/ui/themes/presets';
import { DEFAULT_THEME, type Theme } from './theme';

type ThemePresetModule = {
	defaultTheme?: ThemeDraft;
	theme?: ThemeDraft;
	preset?: ThemeDraft;
};

const presetModules = import.meta.glob('./presets/*.ts', { eager: true }) as Record<
	string,
	ThemePresetModule
>;

const loadedPresets = Object.entries(presetModules)
	.map(([path, module]) => module.defaultTheme ?? module.theme ?? module.preset ?? null)
	.filter((theme): theme is ThemeDraft => Boolean(theme))
	.sort((left, right) => {
		if (left.slug === 'default') return -1;
		if (right.slug === 'default') return 1;
		return left.name.localeCompare(right.name);
	});

export const builtInThemePresets = loadedPresets;
export const defaultTheme =
	builtInThemePresets.find((theme) => theme.slug === 'default') ?? builtInThemePresets[0];

/** Plan 1: the single constrained default. The old preset array stays until Plan 3. */
export const defaultThemeV2: Theme = DEFAULT_THEME;
export const themesV2: Theme[] = [DEFAULT_THEME];
