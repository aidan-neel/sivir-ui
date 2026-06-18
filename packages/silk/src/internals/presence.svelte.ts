/**
 * Presence -- delayed unmount for CSS exit animations.
 *
 * Floating surfaces (popover, modal, sheet, command, toast, ...) render their
 * panel only while open. With CSS-only animations there is no Svelte
 * `transition:` to hold the node in the DOM while it animates out, so this rune
 * keeps `present` true until the exit keyframe finishes (or immediately when the
 * active animation is `none` / motion is reduced).
 *
 * Usage:
 * ```svelte
 * const presence = usePresence(() => uiState.open, () => panelEl);
 * {#if presence.present}
 *   <div bind:this={panelEl} data-state={presence.status}>…</div>
 * {/if}
 * ```
 * The `data-state` attribute drives which keyframe runs; `ui.css` wires
 * `animation` per surface for `[data-state="open"|"closed"]`.
 */
type Getter<T> = () => T;

/** Largest value (in ms) across a comma-separated CSS time list. */
function maxTimeMs(value: string): number {
	const parts = value.split(',').map((part) => {
		const token = part.trim();
		if (token.endsWith('ms')) return Number.parseFloat(token) || 0;
		if (token.endsWith('s')) return (Number.parseFloat(token) || 0) * 1000;
		return Number.parseFloat(token) || 0;
	});
	return parts.length ? Math.max(0, ...parts) : 0;
}

export type Presence = {
	/** Whether the node should be in the DOM (true through the exit animation). */
	readonly present: boolean;
	/** `open` while shown, `closed` while animating out -- bind to `data-state`. */
	readonly status: 'open' | 'closed';
};

export function usePresence(
	open: Getter<boolean>,
	node: Getter<HTMLElement | undefined | null>
): Presence {
	let present = $state(open());
	let status = $state<'open' | 'closed'>(open() ? 'open' : 'closed');

	let frame = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let detach: (() => void) | undefined;

	function clearPending() {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		if (timer) clearTimeout(timer);
		timer = undefined;
		detach?.();
		detach = undefined;
	}

	$effect(() => {
		const isOpen = open();

		if (isOpen) {
			clearPending();
			present = true;
			status = 'open';
			return;
		}

		// Already hidden -- nothing to animate out.
		if (!present) {
			status = 'closed';
			return;
		}

		status = 'closed';
		clearPending();

		// Wait one frame so `data-state="closed"` applies and the exit keyframe is
		// the element's active animation before we measure it.
		frame = requestAnimationFrame(() => {
			frame = 0;
			const el = node();
			if (!el || typeof window === 'undefined') {
				present = false;
				return;
			}

			const cs = getComputedStyle(el);
			const total = maxTimeMs(cs.animationDuration) + maxTimeMs(cs.animationDelay);
			if (cs.animationName === 'none' || total <= 0) {
				present = false;
				return;
			}

			const finish = () => {
				clearPending();
				present = false;
			};
			// Ignore animationend bubbling up from descendants (cascade children).
			const onEnd = (event: AnimationEvent) => {
				if (event.target === el) finish();
			};
			el.addEventListener('animationend', onEnd);
			el.addEventListener('animationcancel', onEnd);
			// Safety net if the animation never reports (e.g. element detached).
			timer = setTimeout(finish, total + 80);
			detach = () => {
				el.removeEventListener('animationend', onEnd);
				el.removeEventListener('animationcancel', onEnd);
			};
		});

		return () => clearPending();
	});

	return {
		get present() {
			return present;
		},
		get status() {
			return status;
		}
	};
}
