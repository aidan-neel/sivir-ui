import { cubicOut, quintOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
	durationVar?: string;
	blur?: number;
	xVar?: string;
	yVar?: string;
	blurVar?: string;
	startVar?: string;
};

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
	if (raw.endsWith('ms')) return Number.parseFloat(raw) || fallback;
	if (raw.endsWith('s')) return (Number.parseFloat(raw) || fallback / 1000) * 1000;
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

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: 8, x: 0, start: 0.985, duration: 240 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;
	const duration =
		params.duration ?? getCssDuration(node, params.durationVar ?? '--motion-duration-panel', 240);
	const offsetX = params.x ?? getCssNumber(node, params.xVar ?? '--motion-panel-x', 0);
	const offsetY = params.y ?? getCssNumber(node, params.yVar ?? '--motion-panel-y', 5);
	const blur = params.blur ?? getCssNumber(node, params.blurVar ?? '--motion-panel-blur', 0);
	const start =
		params.start ?? getCssNumber(node, params.startVar ?? '--motion-panel-scale-start', 0.95);

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
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
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [offsetY, 0]);
			const x = scaleConversion(t, [0, 1], [offsetX, 0]);
			const scale = scaleConversion(t, [0, 1], [start, 1]);
			const filter = blur > 0 ? `blur(${scaleConversion(t, [0, 1], [blur, 0])}px)` : undefined;

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				filter,
				opacity: t
			});
		},
		easing: quintOut
	};
};

type ScaleFadeParams = {
	startScale?: number;
	duration?: number;
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

	return {
		duration: params.duration ?? 250,
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
