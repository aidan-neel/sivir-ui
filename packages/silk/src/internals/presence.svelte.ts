/**
 * Keeps an element mounted across its CSS exit animation.
 *
 * Mirrors a reactive `open` flag into `mounted` (whether to render at all) and
 * `state` ('open' | 'closed', which maps onto `data-state` for the CSS rules in
 * ui.css). When `open` flips false we keep the element mounted, switch state to
 * 'closed' so the out-animation runs, and unmount once that animation ends.
 *
 * This is the CSS-animation counterpart to a Svelte `transition:` directive:
 * `transition:` removed the element after its JS-driven out animation; this lets
 * a data-state-driven CSS keyframe own the exit instead.
 *
 * Usage:
 *   const presence = createPresence(() => uiState.open);
 *   {#if presence.mounted}
 *     <div data-silk-anim="panel" data-state={presence.state}
 *          onanimationend={presence.end}>…</div>
 *   {/if}
 */
export function createPresence(getOpen: () => boolean) {
	let mounted = $state(getOpen());
	let state = $state<'open' | 'closed'>(getOpen() ? 'open' : 'closed');
	let fallback: ReturnType<typeof setTimeout> | undefined;

	function clearFallback() {
		if (fallback) {
			clearTimeout(fallback);
			fallback = undefined;
		}
	}

	$effect(() => {
		if (getOpen()) {
			clearFallback();
			mounted = true;
			state = 'open';
		} else if (mounted) {
			state = 'closed';
			clearFallback();
			// Safety net: unmount even if `animationend` never fires (element
			// never painted, animation cancelled, motion disabled, etc.).
			fallback = setTimeout(() => {
				mounted = false;
				fallback = undefined;
			}, 600);
		}
		return clearFallback;
	});

	return {
		get mounted() {
			return mounted;
		},
		get state() {
			return state;
		},
		/** Bind to the animating element's `onanimationend`. */
		end(event: AnimationEvent) {
			if (state === 'closed' && event.target === event.currentTarget) {
				mounted = false;
				clearFallback();
			}
		}
	};
}
