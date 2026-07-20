// A single shared tooltip surface. Every Tooltip.Trigger drives this one
// element, so moving from one trigger to another *morphs* the same bubble —
// the background stays put while it slides and reshapes around the new label.
//
// Centering trick: the bubble is anchored by its *center* (left = trigger
// centre + translateX(-50%)), so its width can change freely without ever
// drifting off the trigger.
import { computePosition, offset, flip, shift, type Placement } from '@floating-ui/dom';

let bubble: HTMLDivElement | null = null;
let measurer: HTMLSpanElement | null = null;
let label: HTMLSpanElement | null = null;

let visible = false;
let currentText = '';
let activeRef: HTMLElement | null = null;
let lastCenter = 'translateX(-50%)';
let openTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

const SHOW = 'scale(1)';
const HIDE = 'scale(0.94)';

function ensure() {
	if (bubble || typeof document === 'undefined') return;

	const el = document.createElement('div');
	el.setAttribute('data-sivir-tooltip', '');
	el.setAttribute('role', 'tooltip');
	el.className =
		'pointer-events-none fixed top-0 left-0 z-[140] box-border max-w-72 origin-center whitespace-nowrap rounded-[var(--radius-lg)] bg-[var(--color-tooltip)] px-2 py-1 [font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] leading-[1.3] text-[var(--color-tooltip-foreground)] opacity-0 shadow-[var(--elevation-float)] transition-[left,top,width,opacity,transform] [transition-duration:var(--motion-duration-panel),var(--motion-duration-panel),var(--motion-duration-panel),var(--motion-duration-hover),var(--motion-duration-panel)] [transition-timing-function:var(--ease-out)] motion-reduce:transition-none';
	el.style.transform = `translateX(-50%) ${HIDE}`;

	const span = document.createElement('span');
	span.className = 'inline-block whitespace-nowrap';
	el.appendChild(span);
	document.body.appendChild(el);

	// Off-screen twin to measure the target width so the bubble can transition
	// its shape rather than snapping when the label changes length.
	const m = document.createElement('span');
	m.setAttribute('aria-hidden', 'true');
	m.className =
		'pointer-events-none invisible fixed top-0 left-0 box-border whitespace-nowrap px-2 py-1 [font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] leading-[1.3]';
	document.body.appendChild(m);

	bubble = el;
	measurer = m;
	label = span;
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
	})
		.then(({ x, y }) => {
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
		})
		.catch(() => {
			// The active trigger can disappear while Floating UI is measuring it.
			// A removed trigger needs no recovery and must not leak a rejection.
		});
}

function present(ref: HTMLElement, text: string, placement: Placement) {
	if (!bubble || !label) return;
	clearTimeout(closeTimer);
	const morph = visible; // a tooltip is already up → swap to this trigger's label
	activeRef = ref;
	label.textContent = text;
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

/** Re-label the active bubble in place (for example, a Copy→Copied flip). */
export function updateTooltipText(ref: HTMLElement, text: string) {
	if (!visible || activeRef !== ref || !label || !text || text === currentText) return;
	label.textContent = text;
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
	label = null;
}

export function isActiveTooltip(ref: HTMLElement) {
	return visible && activeRef === ref;
}
