import { cubicIn, cubicOut, quintOut } from 'svelte/easing';
import { type EasingFunction, fade, type TransitionConfig } from 'svelte/transition';

/**
 * Reads a CSS duration variable and normalizes it to milliseconds.
 *
 * Each branch tests `Number.isFinite` rather than falling back with `||` so a
 * legitimate `0ms` -- the "None" motion preset -- survives instead of being
 * replaced by the fallback.
 */
export function getCssDuration(node: Element, variableName: string, fallback: number) {
    const raw = getComputedStyle(node).getPropertyValue(variableName).trim();
    if (!raw) {
        return fallback;
    }
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

/**
 * Unit-interval cubic-bezier easing with CSS-compatible control points.
 * Used for the iOS drawer curve, which Svelte's built-in easings cannot express.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction {
    return (t: number) => {
        if (t <= 0) {
            return 0;
        }
        if (t >= 1) {
            return 1;
        }
        let lo = 0;
        let hi = 1;
        let mid = t;
        for (let i = 0; i < 12; i++) {
            const x = sampleBezier(mid, x1, x2);
            if (Math.abs(x - t) < 1e-4) {
                break;
            }
            if (x < t) {
                lo = mid;
            } else {
                hi = mid;
            }
            mid = (lo + hi) / 2;
        }
        return sampleBezier(mid, y1, y2);
    };
}

/** Cubic bezier basis with p0=0 and p3=1: `B(t) = 3(1-t)²t·p1 + 3(1-t)t²·p2 + t³`. */
function sampleBezier(t: number, p1: number, p2: number) {
    const u = 1 - t;
    return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
}

/** iOS-like drawer curve: cubic-bezier(0.32, 0.72, 0, 1) */
const drawerEase = cubicBezier(0.32, 0.72, 0, 1);

function readCssNumber(node: Element, names: string[], fallback: number) {
    const style = getComputedStyle(node);
    for (const name of names) {
        const parsed = Number.parseFloat(style.getPropertyValue(name));
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return fallback;
}

function panelTransition(
    node: Element,
    durationVariable: string,
    fallbackDuration: number,
    options?: {
        easing?: EasingFunction;
        /** Exit mirrors the enter path upward instead of retracing it. */
        exit?: boolean;
        offsetVars?: string[];
        offsetFallback?: number;
        scaleVars?: string[];
        scaleFallback?: number;
        blurVars?: string[];
        blurFallback?: number;
        opacityVars?: string[];
        opacityFallback?: number;
    }
): TransitionConfig {
    const style = getComputedStyle(node);
    const opacity = Number(style.opacity);
    const baseTransform = style.transform === 'none' ? '' : style.transform;
    const baseFilter = style.filter === 'none' ? '' : style.filter;
    const direction = options?.exit ? -1 : 1;
    const offsetY =
        direction *
        readCssNumber(
            node,
            options?.offsetVars ?? ['--motion-panel-y'],
            options?.offsetFallback ?? 2
        );
    const startScale = readCssNumber(
        node,
        options?.scaleVars ?? ['--motion-panel-scale-start'],
        options?.scaleFallback ?? 0.97
    );
    // Exits shrink a quarter as far as enters grow, so the shared start-scale
    // token keeps close animations subtle while open animations stay expressive.
    const endScale = options?.exit ? 1 - (1 - startScale) * 0.25 : startScale;
    const blur = readCssNumber(node, options?.blurVars ?? [], options?.blurFallback ?? 2);
    const opacityStart = readCssNumber(
        node,
        options?.opacityVars ?? ['--motion-opacity-start'],
        options?.opacityFallback ?? 0
    );

    return {
        duration: getCssDuration(node, durationVariable, fallbackDuration),
        easing: options?.easing ?? cubicOut,
        css: (t) => {
            return `opacity:${(opacityStart + (1 - opacityStart) * t) * opacity};transform:${baseTransform} translateY(${(1 - t) * offsetY}px) scale(${endScale + (1 - endScale) * t});filter:${baseFilter} blur(${(1 - t) * blur}px)`;
        }
    };
}

const MENU_MOVEMENT: {
    offsetVars: string[];
    offsetFallback: number;
    scaleVars: string[];
    scaleFallback: number;
    blurVars: string[];
    blurFallback: number;
} = {
    offsetVars: ['--motion-menu-y', '--motion-panel-y'],
    offsetFallback: 2,
    scaleVars: ['--motion-menu-scale-start', '--motion-panel-scale-start'],
    scaleFallback: 0.97,
    blurVars: ['--motion-menu-blur'],
    blurFallback: 2
};

const MODAL_MOVEMENT: typeof MENU_MOVEMENT = {
    offsetVars: ['--motion-modal-y'],
    offsetFallback: 4,
    scaleVars: ['--motion-modal-scale-start'],
    scaleFallback: 0.93,
    blurVars: ['--motion-modal-blur'],
    blurFallback: 2
};

export function panelIn(node: Element) {
    return panelTransition(node, '--motion-duration-panel-in', 110, { ...MENU_MOVEMENT });
}

export function panelOut(node: Element) {
    return panelTransition(node, '--motion-duration-panel-out', 150, { ...MENU_MOVEMENT });
}

type DialogParams = { nested?: boolean };

/** Dialog enter: a soft centered scale that rises into place. Nested reads the slower stack duration to stay in step with the receding parent panel. */
export function dialogIn(node: Element, params: DialogParams = {}) {
    return panelTransition(
        node,
        params.nested ? '--motion-duration-modal-stack-in' : '--motion-duration-modal-in',
        180,
        { ...MODAL_MOVEMENT, easing: quintOut }
    );
}

/** Dialog exit: move slightly upward instead of retracing the enter path. */
export function dialogOut(node: Element, params: DialogParams = {}) {
    return panelTransition(
        node,
        params.nested ? '--motion-duration-modal-stack-out' : '--motion-duration-modal-out',
        110,
        { ...MODAL_MOVEMENT, easing: cubicIn, exit: true }
    );
}

export function overlayIn(node: Element) {
    return fade(node, {
        duration: getCssDuration(node, '--motion-duration-overlay', 120)
    });
}

export const overlayOut = overlayIn;

export type SheetSide = 'left' | 'right';

function sheetSlide(
    node: Element,
    side: SheetSide,
    durationVariable: string,
    fallbackDuration: number
): TransitionConfig {
    const dir = side === 'left' ? -1 : 1;
    const style = getComputedStyle(node);
    const baseTransform = style.transform === 'none' ? '' : style.transform;

    return {
        duration: getCssDuration(node, durationVariable, fallbackDuration),
        easing: drawerEase,
        css: (t) => {
            return `transform:${baseTransform} translate3d(${(1 - t) * 100 * dir}%, 0, 0)`;
        }
    };
}

/** Sheet enter: slides in from the anchored edge with the drawer curve. */
export function sheetIn(node: Element, params: { side?: SheetSide } = {}) {
    return sheetSlide(node, params.side ?? 'right', '--motion-duration-sheet', 280);
}

/** Sheet exit: same path, slightly faster so dismiss feels snappy. */
export function sheetOut(node: Element, params: { side?: SheetSide } = {}) {
    return sheetSlide(node, params.side ?? 'right', '--motion-duration-sheet-out', 200);
}

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
        css: (t) => {
            return (
                `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * paddingTop}px;` +
                `padding-bottom: ${t * paddingBottom}px;` +
                `margin-top: ${t * marginTop}px;` +
                `margin-bottom: ${t * marginBottom}px;` +
                `border-top-width: ${t * borderTopWidth}px;` +
                `border-bottom-width: ${t * borderBottomWidth}px;`
            );
        }
    };
};
