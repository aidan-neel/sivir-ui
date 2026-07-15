import type { ThemeDraft } from '@sivir/ui/themes/presets';
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
	.map(([, module]) => module.defaultTheme ?? module.theme ?? module.preset ?? null)
	.filter((theme): theme is ThemeDraft => Boolean(theme))
	.sort((left, right) => {
		if (left.slug === 'default') return -1;
		if (right.slug === 'default') return 1;
		return left.name.localeCompare(right.name);
	});

// Old engine exports (for restored studio)
export const builtInThemePresets = loadedPresets;
export const defaultTheme =
	builtInThemePresets.find((theme) => theme.slug === 'default') ?? builtInThemePresets[0];

// v2 exports (for new docs gallery)
export const themesV2: Theme[] = [DEFAULT_THEME];
export const defaultThemeV2: Theme = DEFAULT_THEME;
