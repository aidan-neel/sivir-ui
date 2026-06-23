import { cubicOut, quintOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

type FlyNoOpacityParams = {
	y?: number;
	x?: number;
	duration?: number;
	durationVar?: string;
	xVar?: string;
	yVar?: string;
	xMultiplier?: number;
};

/** Reads a CSS duration variable and normalizes it to milliseconds. */
export function getCssDuration(node: Element, variableName: string, fallback: number) {
	const raw = getComputedStyle(node).getPropertyValue(variableName).trim();
	if (!raw) return fallback;
	// Use isFinite over `parsed || fallback` so a legitimate `0ms` (e.g. the
	// "None" motion preset) survives instead of getting replaced by fallback.
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

/** Reads a numeric CSS variable and falls back when it is unset or invalid. */
export function getCssNumber(node: Element, variableName: string, fallback: number) {
	const raw = getComputedStyle(node).getPropertyValue(variableName).trim();
	if (!raw) return fallback;
	const parsed = Number.parseFloat(raw);
	return Number.isFinite(parsed) ? parsed : fallback;
}

/** Applies a directional fly transition without changing opacity. */
export const flyNoOpacity = (
	node: Element,
	params: FlyNoOpacityParams = { y: 8, x: 0, duration: 240 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;
	const duration =
		params.duration ?? getCssDuration(node, params.durationVar ?? '--motion-duration-panel', 240);
	const offsetX =
		params.x ??
		getCssNumber(node, params.xVar ?? '--motion-sheet-offset', 0) * (params.xMultiplier ?? 1);
	const offsetY = params.y ?? getCssNumber(node, params.yVar ?? '--motion-panel-y', 5);

	const scaleConversion = (valueA: number, from: [number, number], to: [number, number]) => {
		const [minA, maxA] = from;
		const [minB, maxB] = to;
		const percentage = (valueA - minA) / (maxA - minA);
		return percentage * (maxB - minB) + minB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration,
		delay: 0,
		easing: quintOut,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [offsetY, 0]);
			const x = scaleConversion(t, [0, 1], [offsetX, 0]);
			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0)`
			});
		}
	};
};

type ThemedSlideParams = {
	durationVar?: string;
	fallback?: number;
};

/** Vertical slide that reads its duration from a CSS motion variable. */
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
