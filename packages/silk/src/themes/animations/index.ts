import type { Animation } from './types';

import { animation as cascade } from './cascade';
import { animation as defaultAnimation } from './default';
import { animation as fade } from './fade';
import { animation as fly } from './fly';
import { animation as none } from './none';
import { animation as scale } from './scale';
import { animation as slide } from './slide';

// Static imports (not import.meta.glob) so this module also loads outside Vite
// -- the CLI registry build imports themeToCss under bun.
export const animations: Animation[] = [defaultAnimation, scale, fly, cascade, fade, slide, none];

/** Default animation slug when a theme does not specify one. */
export const DEFAULT_ANIMATION = 'default';

export function getAnimation(slug: string | null | undefined): Animation {
	return (
		animations.find((a) => a.slug === slug) ??
		animations.find((a) => a.slug === DEFAULT_ANIMATION) ??
		animations[0]
	);
}

/** Serializes an animation into the `--silk-anim-*` keyframe-name variables. */
export function animationToCssVars(animation: Animation): string {
	const k = animation.keyframes;
	return [
		`\t--silk-anim-panel-in: ${k.panelIn};`,
		`\t--silk-anim-panel-out: ${k.panelOut};`,
		`\t--silk-anim-overlay-in: ${k.overlayIn};`,
		`\t--silk-anim-overlay-out: ${k.overlayOut};`,
		`\t--silk-anim-sheet-in: ${k.sheetIn};`,
		`\t--silk-anim-sheet-out: ${k.sheetOut};`
	].join('\n');
}

/**
 * Cascade child-stagger CSS, emitted only for animations with `cascade: true`.
 * An opening panel's direct children animate in one after another. Floating
 * wrappers (nested popovers/submenus) are excluded so their inline floating-ui
 * transform is never clobbered. Select nests items inside a scroll viewport, so
 * the stagger is re-targeted to the viewport's children.
 */
export function cascadeCss(animation: Animation): string {
	if (!animation.cascade) return '';
	const surfaces = [
		'[data-ui="popover-content"]',
		'[data-ui="dialog-content"]',
		'[data-ui="alert-dialog-content"]',
		'[data-ui="command-content"]',
		'[data-ui="sheet-content"]'
	];
	const delays = [40, 55, 70, 85, 100, 115, 130, 145];
	const item = 'silk-cascade-item-in var(--motion-duration-menu) var(--motion-panel-easing) both';
	const blocks: string[] = ['/* Cascade: stagger panel children on enter. */'];

	for (const surface of surfaces) {
		// Direct children stagger, except nested floating wrappers and the select
		// scroll viewport (handled separately so its items stagger instead).
		blocks.push(
			`${surface} > :not([data-bits-floating-content-wrapper], [data-select-viewport]) {\n` +
				`\tanimation: ${item};\n\tanimation-delay: 160ms;\n}`
		);
		for (let i = 0; i < delays.length; i++) {
			blocks.push(`${surface} > *:nth-child(${i + 1}) { animation-delay: ${delays[i]}ms; }`);
		}
	}

	// Select viewport: re-target the stagger to its children.
	blocks.push(`[data-select-viewport] > * {\n\tanimation: ${item};\n\tanimation-delay: 160ms;\n}`);
	for (let i = 0; i < delays.length; i++) {
		blocks.push(
			`[data-select-viewport] > *:nth-child(${i + 1}) { animation-delay: ${delays[i]}ms; }`
		);
	}

	return '\n' + blocks.join('\n');
}

export type { Animation };
