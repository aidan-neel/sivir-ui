import { getCssDuration } from '@sivir-ui/svelte/transition';
import { cubicIn, quintOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export type StepDirection = 1 | -1;

const STEP_IN_FALLBACK = 360;
const STEP_OUT_FALLBACK = 130;

function readPixels(node: Element, variableName: string, fallback: number) {
    const parsed = Number.parseFloat(getComputedStyle(node).getPropertyValue(variableName));

    return Number.isFinite(parsed) ? parsed : fallback;
}

export function getStepInDuration(node: Element) {
    return getCssDuration(node, '--motion-duration-step-in', STEP_IN_FALLBACK);
}

/** Enter from the side the flow travels toward, sharpening from a light blur once the outgoing step has mostly cleared. */
export function stepIn(node: Element, direction: StepDirection): TransitionConfig {
    const distance = readPixels(node, '--motion-step-x', 16);
    const blur = readPixels(node, '--motion-step-blur', 3);
    const outDuration = getCssDuration(node, '--motion-duration-step-out', STEP_OUT_FALLBACK);

    return {
        delay: Math.round(outDuration * 0.7),
        duration: getStepInDuration(node),
        easing: quintOut,
        css: (t, u) => {
            return `opacity:${t};transform:translate3d(${u * direction * distance}px,0,0);filter:blur(${u * blur}px)`;
        }
    };
}

/** Short, soft exit toward the side the flow is leaving; the outgoing step is made inert so it cannot take focus or submit. */
export function stepOut(node: Element, direction: StepDirection): TransitionConfig {
    const distance = readPixels(node, '--motion-step-x', 16) * 0.625;
    const blur = readPixels(node, '--motion-step-blur', 3) * 0.66;

    if (node instanceof HTMLElement) {
        node.inert = true;
        node.setAttribute('aria-hidden', 'true');
    }

    return {
        duration: getCssDuration(node, '--motion-duration-step-out', STEP_OUT_FALLBACK),
        easing: cubicIn,
        css: (t, u) => {
            return `opacity:${t};transform:translate3d(${-u * direction * distance}px,0,0);filter:blur(${u * blur}px)`;
        }
    };
}
