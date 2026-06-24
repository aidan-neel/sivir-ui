import type { ThemeTransitionPreset, ThemeTransitionPresetSlug, ThemeMotion } from './types';
import { preset as bounce } from './bounce';
import { preset as crisp } from './crisp';
import { preset as defaultPreset } from './default';
import { preset as dramatic } from './dramatic';
import { preset as fade } from './fade';
import { preset as gentle } from './gentle';
import { preset as glide } from './glide';
import { preset as instant } from './instant';
import { preset as none } from './none';
import { preset as smooth } from './smooth';
import { preset as snappy } from './snappy';
import { preset as spring } from './spring';
import { preset as swift } from './swift';

// Static list (was `import.meta.glob`, which only resolves under Vite — the CLI
// and unit tests consume these via tsc/bun, so the modules are imported directly).
const allTransitionPresets: ThemeTransitionPreset[] = [
	bounce,
	crisp,
	defaultPreset,
	dramatic,
	fade,
	gentle,
	glide,
	instant,
	none,
	smooth,
	snappy,
	spring,
	swift
];

export const transitionPresets = allTransitionPresets
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
