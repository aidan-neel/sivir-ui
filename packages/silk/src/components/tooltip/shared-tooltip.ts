// A single shared tooltip surface. Every Tooltip.Trigger drives this one
// element, so moving from one trigger to another *morphs* the same bubble —
// the background stays put while it slides, reshapes, and rolls its text
// (via slot-text) into the new label rather than fading out and back in.
//
// Centering trick: the bubble is anchored by its *center* (left = trigger
// centre + translateX(-50%)), so its width can change freely without ever
// drifting off the trigger.
import { computePosition, offset, flip, shift, type Placement } from '@floating-ui/dom';
import { slotText, type SlotTextController } from 'slot-text';
import 'slot-text/style.css';

let bubble: HTMLDivElement | null = null;
let measurer: HTMLSpanElement | null = null;
let controller: SlotTextController | null = null;

let visible = false;
let currentText = '';
let activeRef: HTMLElement | null = null;
let lastCenter = 'translateX(-50%)';
let openTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

const SHOW = 'scale(1)';
const HIDE = 'scale(0.94)';
// Snappy roll, used only when one tooltip morphs into another (or a label
// changes in place). First opens skip it entirely.
const ROLL = { direction: 'up' as const, skipUnchanged: false, duration: 95, stagger: 7 };
const INSTANT = { duration: 0, stagger: 0 };

function ensure() {
	if (bubble || typeof document === 'undefined') return;

	const el = document.createElement('div');
	el.setAttribute('data-silk-tooltip', '');
	el.setAttribute('role', 'tooltip');
	el.style.cssText =
		'position:fixed;left:0;top:0;z-index:140;pointer-events:none;box-sizing:border-box;' +
		'max-width:var(--tooltip-max-width,18rem);' +
		'padding:var(--tooltip-padding-y,6px) var(--tooltip-padding-x,10px);' +
		'border-radius:var(--radius-lg,8px);' +
		'background:var(--color-tooltip);color:var(--color-tooltip-foreground);' +
		'font-size:var(--font-size-label,13px);font-weight:var(--font-weight-label,500);' +
		'letter-spacing:var(--tracking-label,0em);line-height:1.3;white-space:nowrap;' +
		'box-shadow:var(--tooltip-shadow,var(--elevation-float));' +
		'opacity:0;transform:translateX(-50%) ' +
		HIDE +
		';transform-origin:center;' +
		'transition:left 220ms var(--ease-out),top 220ms var(--ease-out),' +
		'width 220ms var(--ease-out),opacity 120ms var(--ease-out),transform 150ms var(--ease-out);';

	const span = document.createElement('span');
	span.style.cssText = 'display:inline-block;white-space:nowrap;';
	el.appendChild(span);
	document.body.appendChild(el);

	// Off-screen twin to measure the target width so the bubble can transition
	// its shape rather than snapping when the label changes length.
	const m = document.createElement('span');
	m.setAttribute('aria-hidden', 'true');
	m.style.cssText =
		'position:fixed;left:-9999px;top:-9999px;pointer-events:none;box-sizing:border-box;white-space:nowrap;' +
		'padding:var(--tooltip-padding-y,6px) var(--tooltip-padding-x,10px);' +
		'font-size:var(--font-size-label,13px);font-weight:var(--font-weight-label,500);' +
		'letter-spacing:var(--tracking-label,0em);line-height:1.3;';
	document.body.appendChild(m);

	bubble = el;
	measurer = m;
	controller = slotText(span, '', {});
}

function applyWidth(text: string) {
	if (!bubble || !measurer) return;
	measurer.textContent = text;
	bubble.style.width = `${measurer.offsetWidth}px`;
}

function reposition(ref: HTMLElement, placement: Placement, animated: boolean) {
	if (!bubble) return;
	void computePosition(ref, bubble, {
		// The bubble is position:fixed, so coords must be viewport-relative —
		// otherwise it drifts by the page scroll once you scroll to a component.
		strategy: 'fixed',
		placement,
		middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })]
	}).then(({ x, y }) => {
		if (!bubble || activeRef !== ref) return;
		const horizontal = placement === 'top' || placement === 'bottom';
		const center = horizontal ? 'translateX(-50%)' : 'translateY(-50%)';
		lastCenter = center;
		// Anchor by the bubble's centre so width/height changes never decentre it.
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
			if (!bubble || activeRef !== ref) return;
			bubble.style.opacity = '1';
			bubble.style.transform = `${center} ${SHOW}`;
		});
	});
}

function present(ref: HTMLElement, text: string, placement: Placement) {
	if (!bubble || !controller) return;
	clearTimeout(closeTimer);
	const morph = visible; // a tooltip is already up → animate the text swap
	activeRef = ref;
	if (morph) {
		if (text !== currentText) controller.set(text, ROLL);
	} else {
		// First open of a normal tooltip: just place the text, no roll.
		controller.set(text, INSTANT);
	}
	currentText = text;
	applyWidth(text);
	reposition(ref, placement, morph);
	visible = true;
}

/** Hover/focus a trigger: show after `delay`, or morph instantly if one is already up. */
export function showTooltip(
	ref: HTMLElement,
	text: string,
	placement: Placement = 'top',
	delay = 125
) {
	if (typeof document === 'undefined' || !text) return;
	ensure();
	clearTimeout(openTimer);
	clearTimeout(closeTimer);
	if (visible || delay <= 0) {
		present(ref, text, placement);
	} else {
		openTimer = setTimeout(() => present(ref, text, placement), delay);
	}
}

/** Re-label the active bubble in place with a roll (e.g. a Copy→Copied flip). */
export function updateTooltipText(ref: HTMLElement, text: string) {
	if (!visible || activeRef !== ref || !controller || !text || text === currentText) return;
	controller.set(text, ROLL);
	currentText = text;
	applyWidth(text); // width transitions; centre-anchor keeps it aligned
}

/** Force the bubble up now and, unless the pointer is over the trigger, auto-hide after `holdMs`. */
export function flashTooltip(
	ref: HTMLElement,
	text: string,
	placement: Placement = 'top',
	holdMs = 1500
) {
	if (typeof document === 'undefined' || !text) return;
	ensure();
	clearTimeout(openTimer);
	present(ref, text, placement);
	const hovered = typeof ref.matches === 'function' && ref.matches(':hover');
	if (!hovered) {
		clearTimeout(closeTimer);
		closeTimer = setTimeout(dismiss, holdMs);
	}
}

function dismiss() {
	if (!bubble) return;
	visible = false;
	activeRef = null;
	bubble.style.opacity = '0';
	bubble.style.transform = `${lastCenter} ${HIDE}`;
}

/** Leave/blur a trigger: schedule a hide, ignored if a different trigger took over. */
export function hideTooltip(ref: HTMLElement | null, closeDelay = 100) {
	clearTimeout(openTimer);
	if (ref && activeRef && ref !== activeRef) return;
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
	openTimer = undefined;
	closeTimer = undefined;
	visible = false;
	activeRef = null;
	currentText = '';
	lastCenter = 'translateX(-50%)';
	bubble?.remove();
	measurer?.remove();
	bubble = null;
	measurer = null;
	controller = null;
}

export function isActiveTooltip(ref: HTMLElement) {
	return visible && activeRef === ref;
}
