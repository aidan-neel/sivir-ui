import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

/**
 * Timing-driven Svelte transitions for the cases CSS keyframes can't express:
 * animating to/from `height: auto` (accordion, collapsible) and small content
 * micro-transitions (checkbox check). Panel/overlay/sheet *shape* now lives in
 * CSS keyframes (see `themes/animations` + `ui.css`); these read the active
 * feel's duration variables so they stay in sync with the theme.
 */

/** Reads a CSS duration variable and normalizes it to milliseconds. */
export function getCssDuration(node: Element, variableName: string, fallback: number) {
	const raw = getComputedStyle(node).getPropertyValue(variableName).trim();
	if (!raw) return fallback;
	// Use isFinite over `parsed || fallback` so a legitimate `0ms` survives
	// instead of getting replaced by the fallback.
	if (raw.endsWith('ms')) {
		const parsed = Number.parseFloat(raw);
		return Number.isFinite(parsed) ? parsed : fallback;
	}
	if (raw.endsWith('s')) {
		const parsed = Number.parseFloat(raw);
		return Number.isFinite(parsed) ? parsed * 1000 : fallback;
	}
	const parsed = Number.parseFloat(raw);
	return Number.isFinite(parsed) ? parsed : fallback;
}

type ThemedSlideParams = {
	durationVar?: string;
	fallback?: number;
};

/** Vertical height-collapse that reads its duration from a CSS motion variable. */
export const themedSlide = (node: Element, params: ThemedSlideParams = {}): TransitionConfig => {
	const duration = getCssDuration(
		node,
		params.durationVar ?? '--motion-duration-panel',
		params.fallback ?? 220
	);
	const style = getComputedStyle(node);
	const opacity = +style.opacity;
	const height = parseFloat(style.height);
	const paddingTop = parseFloat(style.paddingTop);
	const paddingBottom = parseFloat(style.paddingBottom);
	const marginTop = parseFloat(style.marginTop);
	const marginBottom = parseFloat(style.marginBottom);
	const borderTopWidth = parseFloat(style.borderTopWidth);
	const borderBottomWidth = parseFloat(style.borderBottomWidth);
	return {
		duration,
		delay: 0,
		easing: cubicOut,
		css: (t) =>
			`overflow: hidden;` +
			`opacity: ${Math.min(t * 20, 1) * opacity};` +
			`height: ${t * height}px;` +
			`padding-top: ${t * paddingTop}px;` +
			`padding-bottom: ${t * paddingBottom}px;` +
			`margin-top: ${t * marginTop}px;` +
			`margin-bottom: ${t * marginBottom}px;` +
			`border-top-width: ${t * borderTopWidth}px;` +
			`border-bottom-width: ${t * borderBottomWidth}px;`
	};
};

type ScaleFadeParams = {
	startScale?: number;
	duration?: number;
	durationVar?: string;
};

/** Combines a small scale-up with a fade-in for compact content. */
export const scaleFade = (
	node: Element,
	params: ScaleFadeParams = { startScale: 0.85, duration: 250 }
): TransitionConfig => {
	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + key + ':' + style[key] + ';';
		}, '');
	};

	const duration = params.durationVar
		? getCssDuration(node, params.durationVar, params.duration ?? 250)
		: (params.duration ?? 250);

	return {
		duration,
		delay: 0,
		easing: cubicOut,
		css: (t) => {
			const scale = (params.startScale ?? 0.85) + (1 - (params.startScale ?? 0.85)) * t;
			return styleToString({
				transform: `scale(${scale})`,
				opacity: t
			});
		}
	};
};
