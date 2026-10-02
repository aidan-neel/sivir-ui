/**
 * A single shared tooltip surface.
 *
 * Every Tooltip.Trigger drives this one element, so moving from one trigger to
 * another *morphs* the same bubble -- the background stays put while it slides
 * and reshapes around the new label.
 *
 * Centering trick: the bubble is anchored by its *center* (left = trigger
 * centre + `translateX(-50%)`), so its width can change freely without ever
 * drifting off the trigger.
 *
 * Presentation lives in `ui.css` under `.sivir-tooltip`.
 */
import { autoUpdate, computePosition, flip, offset, type Placement, shift } from '@floating-ui/dom';
import '@scritto/core';
import type { Scritto as ScrittoElement } from '@scritto/core';
import type { TooltipState } from '.';

export type TooltipRuntimeState = TooltipState & {
    shortcut: string;
};

let bubble: HTMLDivElement | null = null;
let measurer: HTMLSpanElement | null = null;
let label: HTMLSpanElement | null = null;
let keys: HTMLElement | null = null;
let measuredKeys: HTMLElement | null = null;
let roller: ScrittoElement | null = null;
let currentClass = '';

let visible = false;
let currentText = '';
let currentShortcut = '';
let activeRef: HTMLElement | null = null;
let lastCenter = 'translateX(-50%)';
let openTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let stopTracking: (() => void) | undefined;

const SHOW = 'scale(1)';
const HIDE = 'scale(0.94)';
const SHORTCUT_CLASS =
    // token-lint-disable-next-line no-literal-length: optical baseline and keycap tracking match the label text
    'ms-2 inline-block min-w-5 rounded-[var(--radius-sm)] bg-[color-mix(in_oklab,var(--color-tooltip-foreground)_14%,transparent)] px-1 text-center align-[0.0625rem] font-sans text-[length:var(--font-size-meta)] leading-5 tracking-[0.12em] text-[color-mix(in_oklab,var(--color-tooltip-foreground)_72%,transparent)] empty:hidden';

/**
 * Whether this platform can drive a Scritto roll. The unit-test DOM has no
 * `matchMedia` or Web Animations `getAnimations`, so it keeps the plain
 * textContent swap there while real browsers roll.
 */
function supportsRoll(): boolean {
    return (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        typeof Element !== 'undefined' &&
        typeof Element.prototype.getAnimations === 'function'
    );
}

function swapDuration() {
    if (!bubble) {
        return 0;
    }

    const raw = getComputedStyle(bubble).getPropertyValue('--motion-duration-swap').trim();
    const parsed = Number.parseFloat(raw);

    if (!Number.isFinite(parsed)) {
        return 300;
    }

    return raw.endsWith('ms') ? parsed : parsed * 1000;
}

/**
 * Writes `text` into the bubble label. Single-word labels ride the roller
 * (rolling when `animate`, set instantly otherwise); anything with whitespace
 * keeps the plain textContent swap so multi-word rows never hit the roller's
 * word layout.
 */
function setLabel(text: string, animate: boolean) {
    if (!label) {
        return;
    }
    if (roller && !/\s/.test(text)) {
        if (roller.parentNode !== label) {
            label.replaceChildren(roller);
        }
        const duration = animate ? swapDuration() : 0;

        if (duration > 0) {
            roller.setOptions({ transition: { duration } });
            roller.update(text);
        } else {
            roller.value = text;
        }
        return;
    }
    label.textContent = text;
}

/**
 * Lazily builds the bubble, its label span, and the off-screen measuring twin.
 *
 * The twin exists so `applyWidth` can read a target width before the label
 * swaps, letting the bubble transition its shape instead of snapping when the
 * new label is a different length.
 *
 * The label span hosts a `<scritto-text>` roller when the platform supports
 * it; `setLabel` routes single-word labels through it.
 */
function ensure() {
    if (bubble || typeof document === 'undefined') {
        return;
    }

    const el = document.createElement('div');
    el.setAttribute('data-sivir-tooltip', '');
    el.setAttribute('role', 'tooltip');
    el.className = 'sivir-tooltip';
    el.style.transform = `translateX(-50%) ${HIDE}`;

    const span = document.createElement('span');
    span.className = 'sivir-tooltip-label';
    el.appendChild(span);

    const kbd = document.createElement('kbd');
    kbd.className = SHORTCUT_CLASS;
    el.appendChild(kbd);
    document.body.appendChild(el);

    const m = document.createElement('span');
    m.setAttribute('aria-hidden', 'true');
    m.className = 'sivir-tooltip-measure';
    document.body.appendChild(m);

    bubble = el;
    measurer = m;
    label = span;
    keys = kbd;
    measuredKeys = kbd.cloneNode() as HTMLElement;

    if (supportsRoll()) {
        const host = document.createElement('scritto-text') as ScrittoElement;
        host.setOptions({ transition: { duration: 300 } });
        span.appendChild(host);
        roller = host;
    }
}

function applyBubbleClass(className = '') {
    if (!bubble) {
        return;
    }
    currentClass = className;
    bubble.className = className ? `sivir-tooltip ${className}` : 'sivir-tooltip';
    if (measurer) {
        measurer.className = className
            ? `sivir-tooltip-measure ${className}`
            : 'sivir-tooltip-measure';
    }
}

function setShortcut(shortcut: string) {
    if (keys) {
        keys.textContent = shortcut;
    }
    currentShortcut = shortcut;
}

/** Sizes the bubble to the measured width of `text` and `shortcut` so the change can transition. */
function applyWidth(text: string, shortcut: string) {
    if (!bubble || !measurer || !measuredKeys) {
        return;
    }
    measuredKeys.textContent = shortcut;
    measurer.replaceChildren(document.createTextNode(text), measuredKeys);
    bubble.style.width = `${measurer.offsetWidth}px`;
}

/**
 * Places the bubble against `ref`.
 *
 * The `fixed` strategy is required because the bubble is `position: fixed` --
 * with absolute coordinates it drifts by the page scroll once you scroll down to
 * a component. The result is anchored by the bubble's centre so width and height
 * changes never decentre it. Rejections are swallowed: the active trigger can
 * disappear while Floating UI is measuring it, and a removed trigger needs no
 * recovery and must not leak an unhandled rejection.
 */
function reposition(ref: HTMLElement, placement: Placement, animated: boolean) {
    if (!bubble) {
        return;
    }
    void computePosition(ref, bubble, {
        strategy: 'fixed',
        placement,
        middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })]
    })
        .then(({ x, y }) => {
            if (!bubble || activeRef !== ref) {
                return;
            }
            const horizontal = placement === 'top' || placement === 'bottom';
            const center = horizontal ? 'translateX(-50%)' : 'translateY(-50%)';
            lastCenter = center;
            const left = horizontal ? x + bubble.offsetWidth / 2 : x;
            const top = horizontal ? y : y + bubble.offsetHeight / 2;

            if (animated) {
                bubble.style.left = `${left}px`;
                bubble.style.top = `${top}px`;
            } else {
                const prev = bubble.style.transition;
                bubble.style.transition = 'none';
                bubble.style.transform = `${center} ${HIDE}`;
                bubble.style.left = `${left}px`;
                bubble.style.top = `${top}px`;
                void bubble.offsetHeight;
                bubble.style.transition = prev;
            }
            requestAnimationFrame(() => {
                if (!bubble || activeRef !== ref) {
                    return;
                }
                bubble.style.opacity = '1';
                bubble.style.transform = `${center} ${SHOW}`;
            });
        })
        .catch(() => {});
}

/**
 * Keeps the open bubble glued to `ref` across scroll, resize, and layout
 * shifts. The update only moves `left`/`top`, so the bubble glides on its
 * existing transition instead of replaying the show animation.
 */
function trackPosition(ref: HTMLElement, placement: Placement) {
    stopTracking?.();
    if (!bubble) {
        return;
    }
    stopTracking = autoUpdate(ref, bubble, () => {
        if (activeRef === ref) {
            reposition(ref, placement, true);
        }
    });
}

/** Shows the bubble for `ref`; when one is already up it morphs to this label. */
function present(
    ref: HTMLElement,
    text: string,
    placement: Placement,
    className = '',
    shortcut = ''
) {
    if (!bubble || !label) {
        return;
    }
    clearTimeout(closeTimer);
    const morph = visible;
    activeRef = ref;
    setLabel(text, false);
    currentText = text;
    setShortcut(shortcut);
    applyBubbleClass(className);
    applyWidth(text, shortcut);
    reposition(ref, placement, morph);
    trackPosition(ref, placement);
    visible = true;
}

/** Hover/focus a trigger: show after `delay`, or morph instantly if one is already up. */
export function showTooltip(
    ref: HTMLElement,
    text: string,
    placement: Placement = 'top',
    delay = 125,
    className = '',
    shortcut = ''
) {
    if (typeof document === 'undefined' || !text) {
        return;
    }
    ensure();
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    if (visible || delay <= 0) {
        present(ref, text, placement, className, shortcut);
    } else {
        openTimer = setTimeout(() => present(ref, text, placement, className, shortcut), delay);
    }
}

/** Re-label the active bubble in place (for example, a Copy→Copied flip). */
export function updateTooltipText(ref: HTMLElement, text: string, shortcut = '') {
    if (!visible || activeRef !== ref || !label || !text) {
        return;
    }
    if (text === currentText && shortcut === currentShortcut) {
        return;
    }
    if (text !== currentText) {
        setLabel(text, true);
        currentText = text;
    }
    setShortcut(shortcut);
    applyWidth(text, shortcut);
}

export function updateTooltipClass(ref: HTMLElement, className: string) {
    if (!visible || activeRef !== ref || className === currentClass) {
        return;
    }
    applyBubbleClass(className);
    applyWidth(currentText, currentShortcut);
}

/** Force the bubble up now and, unless the pointer is over the trigger, auto-hide after `holdMs`. */
export function flashTooltip(
    ref: HTMLElement,
    text: string,
    placement: Placement = 'top',
    holdMs = 1500,
    className = '',
    shortcut = ''
) {
    if (typeof document === 'undefined' || !text) {
        return;
    }
    ensure();
    clearTimeout(openTimer);
    present(ref, text, placement, className, shortcut);
    const hovered = typeof ref.matches === 'function' && ref.matches(':hover');
    if (!hovered) {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(dismiss, holdMs);
    }
}

function dismiss() {
    if (!bubble) {
        return;
    }
    stopTracking?.();
    stopTracking = undefined;
    visible = false;
    activeRef = null;
    bubble.style.opacity = '0';
    bubble.style.transform = `${lastCenter} ${HIDE}`;
}

/** Leave/blur a trigger: schedule a hide, ignored if a different trigger took over. */
export function hideTooltip(ref: HTMLElement | null, closeDelay = 100) {
    clearTimeout(openTimer);
    if (ref && activeRef && ref !== activeRef) {
        return;
    }
    clearTimeout(closeTimer);
    closeTimer = setTimeout(dismiss, closeDelay);
}

/**
 * Test-only: tear down the shared bubble and clear its timers/state so browser
 * suites don't leak an open tooltip (or a pending open timer) from one case
 * into the next.
 */
export function resetSharedTooltipForTests() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    stopTracking?.();
    stopTracking = undefined;
    openTimer = undefined;
    closeTimer = undefined;
    visible = false;
    activeRef = null;
    currentText = '';
    currentShortcut = '';
    currentClass = '';
    lastCenter = 'translateX(-50%)';
    bubble?.remove();
    measurer?.remove();
    bubble = null;
    measurer = null;
    label = null;
    keys = null;
    measuredKeys = null;
    roller = null;
}

export function isActiveTooltip(ref: HTMLElement) {
    return visible && activeRef === ref;
}
