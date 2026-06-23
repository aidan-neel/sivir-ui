<script lang="ts" module>
	// Shared across all Popover.Content instances. Nested popovers
	// (dropdown → submenu, etc.) reference-count so the body lock only
	// releases when the last open one closes.
	let openCount = 0;
	let savedOverflow = '';
	let savedPaddingRight = '';

	function isOverlay(el: Element) {
		// Popover wrappers are portaled to body without an id (the id lives on
		// the inner content div) -- match the `data-floating-content` attribute
		// they always carry, plus the well-known overlay id prefixes for Modal,
		// Dialog, Sheet, Command (which portal the labeled element directly).
		if (el.hasAttribute('data-floating-content')) return true;
		const id = el.id;
		return (
			id.startsWith('popover-') ||
			id.startsWith('modal-') ||
			id.startsWith('dialog-') ||
			id.startsWith('sheet-') ||
			id.startsWith('command-')
		);
	}

	function acquireLock() {
		if (typeof document === 'undefined') return;
		if (openCount === 0) {
			savedOverflow = document.body.style.overflow;
			const sbw = window.innerWidth - document.documentElement.clientWidth;
			if (sbw > 0) {
				savedPaddingRight = document.body.style.paddingRight;
				document.body.style.paddingRight = `${sbw}px`;
			}
			document.body.style.overflow = 'hidden';
			for (const el of Array.from(document.body.children) as HTMLElement[]) {
				if (isOverlay(el)) continue;
				el.classList.add('pointer-events-none');
			}
		}
		openCount += 1;
	}

	function releaseLock() {
		if (typeof document === 'undefined') return;
		openCount = Math.max(0, openCount - 1);
		if (openCount === 0) {
			document.body.style.overflow = savedOverflow;
			document.body.style.paddingRight = savedPaddingRight;
			savedOverflow = '';
			savedPaddingRight = '';
			for (const el of Array.from(document.body.children) as HTMLElement[]) {
				el.classList.remove('pointer-events-none');
			}
		}
	}
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { clickOutside, cn, positionFloatingPanel, trapFocus } from '@silk/ui/utils';
	import { createPresence } from '@silk/ui/internals/presence.svelte.ts';
	import { getContext } from 'svelte';
	import type { PopoverContentProps, PopoverState } from '.';

	const {
		children,
		class: classProp,
		allowClickOutside = true,
		portal = true,
		refElement,
		role = 'dialog',
		tabindex = -1,
		focusTrap = true,
		id,
		'aria-modal': ariaModalProp,
		...rest
	}: PopoverContentProps = $props();

	const key = getContext('key') as string;
	const uiState = states[key].data as PopoverState;

	// Keep the content mounted through its CSS exit animation.
	const presence = createPresence(() => uiState.open);

	let popover = $state<HTMLElement | undefined>();
	let panelEl = $state<HTMLElement | undefined>();
	let clickOutsideCleanup: (() => void) | undefined;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			uiState.open = false;
		}
	}

	function updatePosition() {
		if (!uiState || !popover) return;
		const reference = refElement ?? uiState.buttonRef;
		if (!reference) return;

		const triggerWidth = uiState.buttonRef?.getBoundingClientRect().width;
		if (triggerWidth) {
			popover.style.setProperty('--popover-trigger-width', `${triggerWidth}px`);
		}

		positionFloatingPanel(reference, popover, refElement ? 'right-start' : uiState.placement);
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('scroll', updatePosition);

		window.addEventListener('resize', updatePosition);
		window.addEventListener('scroll', updatePosition, true);

		uiState.popoverRef = popover;

		if (portal && document && popover) {
			document.body.appendChild(popover);
		}

		if (allowClickOutside && popover) {
			const outside = clickOutside(
				popover,
				() => {
					uiState.open = false;
				},
				uiState.buttonRef ? [uiState.buttonRef] : []
			);
			clickOutsideCleanup = outside.destroy;
		}

		const ro = new ResizeObserver(updatePosition);
		if (uiState?.buttonRef) ro.observe(uiState.buttonRef);
		if (popover) ro.observe(popover);

		// These fire on document focus changes -- including the focusout that the
		// browser dispatches synchronously while the content is being removed from
		// the DOM. Defer the state write to a microtask so we never mutate
		// reactive state in the middle of the Svelte flush that unmounts us
		// (which throws state_unsafe_mutation). The DOM is read synchronously.
		const handleFocusIn = (e: FocusEvent) => {
			const target = e.target as HTMLElement;
			if (!target) return;

			const openPopovers = Array.from(document.body.children).filter(
				(el) => el.id.startsWith('popover-') && !el.id.includes('controls')
			);
			const inside = openPopovers.some((el) => el.contains(target));
			queueMicrotask(() => {
				uiState.focusedInside = inside;
			});
		};

		const handleFocusOut = () => {
			queueMicrotask(() => {
				uiState.focusedInside = false;
			});
		};

		document.addEventListener('focusin', handleFocusIn);
		document.addEventListener('focusout', handleFocusOut);

		onDestroy(() => {
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('scroll', updatePosition);
			window.removeEventListener('resize', updatePosition);
			window.removeEventListener('scroll', updatePosition, true);
			document.removeEventListener('focusin', handleFocusIn);
			document.removeEventListener('focusout', handleFocusOut);
			ro.disconnect();
			clickOutsideCleanup?.();
			if (uiState.open) releaseLock();

			uiState.open = false;
			uiState.popoverRef?.remove();
			popover?.remove();
		});
	});

	function cancelClose() {
		if (uiState?.closeTimeout) {
			if (uiState?.hoverable) {
				clearTimeout(uiState.closeTimeout);
				uiState.closeTimeout = undefined;
			}
		}
	}

	// Lock body scroll + inert background siblings whenever the popover is open.
	// Hoverable popovers (tooltip, hover-card) skip the lock because the
	// pointer-events-none on body children would kill mouseleave/mouseenter
	// on the trigger and cause an open/close flicker loop.
	$effect(() => {
		if (typeof document === 'undefined') return;
		if (uiState.open && popover && !uiState.hoverable) {
			acquireLock();
			return () => releaseLock();
		}
	});

	$effect(() => {
		if (!uiState.hovering && !uiState.focusedInside) {
			cancelClose();
		}
	});

	// Position the panel the moment it opens, before the browser paints. This
	// sets left/top *and* --popover-trigger-width synchronously, so the panel
	// never flashes at its (0,0) origin — the cause of the tooltip-swap jitter —
	// nor at auto width before snapping to the trigger (the combobox jump).
	// Without this we'd rely on the ResizeObserver firing a frame later.
	$effect(() => {
		if (uiState.open && presence.mounted && popover) {
			updatePosition();
		}
	});

	// Trap Tab focus inside the panel while open. Hoverable surfaces (tooltip,
	// hover-card) are excluded -- they aren't keyboard-modal and stealing focus
	// would fight their pointer-driven open/close.
	$effect(() => {
		if (uiState.open && panelEl && !uiState.hoverable && focusTrap) {
			const cleanup = trapFocus(panelEl);
			return cleanup;
		}
	});
</script>

<div
	role="presentation"
	data-floating-content
	class={cn(
		'absolute left-0 top-0 z-[130] flex max-w-[calc(100vw-2*var(--popover-viewport-margin))] max-h-[calc(100vh-2*var(--popover-viewport-margin))] items-center justify-center'
	)}
	bind:this={popover as HTMLElement}
	onmouseenter={cancelClose}
	onmouseleave={() => {
		if (uiState?.hoverable) {
			if (popover && popover.contains(document.activeElement)) {
				return;
			}
			uiState.open = false;
		}
	}}
>
	{#if presence.mounted}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			{...rest}
			data-silk-anim="panel"
			data-state={presence.state}
			onanimationend={presence.end}
			bind:this={panelEl}
			id={id ?? `popover-${String(key)}-content`}
			{role}
			aria-modal={ariaModalProp ??
				(role === 'dialog' || role === 'alertdialog' ? 'true' : undefined)}
			aria-labelledby={rest['aria-label']
				? undefined
				: role === 'dialog' || role === 'alertdialog'
					? `popover-${String(key)}-title`
					: undefined}
			{tabindex}
			data-ui="popover-content"
			class={cn(
				classProp,
				`bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[var(--panel-shadow)] p-[var(--panel-padding)] text-sm m-auto max-w-[min(var(--popover-available-width,calc(100vw-2*var(--popover-viewport-margin))),calc(100vw-2*var(--popover-viewport-margin)))] max-h-[min(var(--popover-available-height,calc(100vh-2*var(--popover-viewport-margin))),calc(100vh-2*var(--popover-viewport-margin)))] overflow-auto`
			)}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
