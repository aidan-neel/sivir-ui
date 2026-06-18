import type { Feel } from './types';

import { feel as balanced } from './balanced';
import { feel as instant } from './instant';
import { feel as relaxed } from './relaxed';
import { feel as smooth } from './smooth';
import { feel as snappy } from './snappy';

// Static imports (not import.meta.glob) so this module also loads outside Vite
// -- the CLI registry build imports themeToCss under bun.
export const feels: Feel[] = [instant, snappy, smooth, balanced, relaxed];

/** Default feel slug when a theme does not specify one. */
export const DEFAULT_FEEL = 'smooth';

export function getFeel(slug: string | null | undefined): Feel {
	return (
		feels.find((f) => f.slug === slug) ?? feels.find((f) => f.slug === DEFAULT_FEEL) ?? feels[0]
	);
}

/** Serializes a feel into the timing CSS variables the components consume. */
export function feelToCssVars(feel: Feel): string {
	const d = feel.durations;
	return [
		`\t--motion-duration-hover: ${d.hover};`,
		`\t--motion-duration-menu: ${d.menu};`,
		`\t--motion-duration-panel: ${d.panel};`,
		`\t--motion-duration-sheet: ${d.sheet};`,
		`\t--motion-duration-overlay: ${d.overlay};`,
		`\t--motion-duration-tooltip: ${d.tooltip};`,
		`\t--motion-duration-toast-in: ${d.toastIn};`,
		`\t--motion-duration-toast-out: ${d.toastOut};`,
		`\t--motion-panel-easing: ${feel.easing};`,
		`\t--motion-easing-hover: ${feel.easingHover};`
	].join('\n');
}

export type { Feel };
