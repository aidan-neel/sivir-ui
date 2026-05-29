import type { ThemeDraft } from '@silk/ui/themes/presets';

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
export const defaultTheme = builtInThemePresets.find((theme) => theme.slug === 'default') ?? builtInThemePresets[0];
