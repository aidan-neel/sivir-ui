import { cubicIn, cubicOut, quintOut } from 'svelte/easing';
import { fade, type EasingFunction, type TransitionConfig } from 'svelte/transition';

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

function getCssNumber(node: Element, variableName: string, fallback: number) {
	const parsed = Number.parseFloat(getComputedStyle(node).getPropertyValue(variableName));
	return Number.isFinite(parsed) ? parsed : fallback;
}

function panelTransition(
	node: Element,
	durationVariable: string,
	fallbackDuration: number,
	options?: {
		offsetY?: number;
		startScale?: number;
		easing?: EasingFunction;
	}
): TransitionConfig {
	const style = getComputedStyle(node);
	const opacity = Number(style.opacity);
	const baseTransform = style.transform === 'none' ? '' : style.transform;
	const offsetY = options?.offsetY ?? getCssNumber(node, '--motion-panel-y', 2);
	const startScale = options?.startScale ?? getCssNumber(node, '--motion-panel-scale-start', 0.97);

	return {
		duration: getCssDuration(node, durationVariable, fallbackDuration),
		easing: options?.easing ?? cubicOut,
		css: (t) =>
			`opacity:${t * opacity};transform:${baseTransform} translateY(${(1 - t) * offsetY}px) scale(${startScale + (1 - startScale) * t})`
	};
}

export function panelIn(node: Element) {
	return panelTransition(node, '--motion-duration-panel-in', 110);
}

export function panelOut(node: Element) {
	return panelTransition(node, '--motion-duration-panel-out', 150);
}

/** Dialog enter: a soft centered scale that rises into place. */
export function dialogIn(node: Element) {
	return panelTransition(node, '--motion-duration-modal-in', 180, {
		offsetY: 4,
		startScale: 0.93,
		easing: quintOut
	});
}

/** Dialog exit: move slightly upward instead of retracing the enter path. */
export function dialogOut(node: Element) {
	return panelTransition(node, '--motion-duration-modal-out', 110, {
		offsetY: -3,
		startScale: 0.98,
		easing: cubicIn
	});
}

export function overlayIn(node: Element) {
	return fade(node, {
		duration: getCssDuration(node, '--motion-duration-overlay', 120)
	});
}

export const overlayOut = overlayIn;

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
