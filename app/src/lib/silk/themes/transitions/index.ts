import type { ThemeTransitionPreset, ThemeTransitionPresetSlug, ThemeMotion } from './types';

type ThemeTransitionPresetModule = {
	preset?: ThemeTransitionPreset;
	transition?: ThemeTransitionPreset;
	defaultPreset?: ThemeTransitionPreset;
};

const transitionModules = import.meta.glob('./*.ts', { eager: true }) as Record<
	string,
	ThemeTransitionPresetModule
>;

export const transitionPresets = Object.values(transitionModules)
	.map((module) => module.preset ?? module.transition ?? module.defaultPreset ?? null)
	.filter((preset): preset is ThemeTransitionPreset => Boolean(preset))
	.sort((left, right) => {
		if (left.slug === 'default') return -1;
		if (right.slug === 'default') return 1;
		return left.name.localeCompare(right.name);
	});

export function getTransitionPreset(slug: ThemeTransitionPresetSlug) {
	return transitionPresets.find((preset) => preset.slug === slug) ?? transitionPresets[0];
}

export function cloneTransitionMotion(motion: ThemeMotion): ThemeMotion {
	return JSON.parse(JSON.stringify(motion)) as ThemeMotion;
}

export type { ThemeTransitionPreset, ThemeTransitionPresetSlug, ThemeMotion };
