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
	import { clickOutside, cn, positionFloatingPanel, trapFocus } from '@sivir/ui/utils';
	import { panelIn, panelOut } from '@sivir/ui/internals/transition';
	import type { PopoverContentProps } from '.';
	import { getPopoverContext } from './context.svelte';

	const {
		children,
		class: classProp,
		surfaceClass,
		allowClickOutside = true,
		portal = true,
		refElement,
		role = 'dialog',
		tabindex = -1,
		focusTrap = true,
		lockScroll = true,
		id,
		'aria-modal': ariaModalProp,
		...rest
	}: PopoverContentProps = $props();

	const { id: key, state: popoverState } = getPopoverContext();

	let popover = $state<HTMLElement | undefined>();
	let panelEl = $state<HTMLElement | undefined>();
	let clickOutsideCleanup: (() => void) | undefined;
	let positionFrame: number | undefined;
	let mounted = false;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			popoverState.open = false;
		}
	}

	function updatePosition() {
		if (!popover) return;
		const reference = refElement ?? popoverState.buttonRef;
		if (!reference) return;

		const triggerWidth = popoverState.buttonRef?.getBoundingClientRect().width;
		if (triggerWidth) {
			popover.style.setProperty('--popover-trigger-width', `${triggerWidth}px`);
		}

		positionFloatingPanel(reference, popover, refElement ? 'right-start' : popoverState.placement);
	}

	function schedulePosition() {
		if (positionFrame !== undefined) return;
		positionFrame = requestAnimationFrame(() => {
			positionFrame = undefined;
			updatePosition();
		});
	}

	onMount(() => {
		mounted = true;
		document.addEventListener('keydown', handleKeydown);
		document.addEventListener('scroll', schedulePosition);

		window.addEventListener('resize', schedulePosition);
		window.addEventListener('scroll', schedulePosition, true);

		popoverState.popoverRef = popover;

		if (portal && document && popover) {
			document.body.appendChild(popover);
		}

		if (allowClickOutside && popover) {
			const outside = clickOutside(
				popover,
				() => {
					popoverState.open = false;
				},
				popoverState.buttonRef ? [popoverState.buttonRef] : []
			);
			clickOutsideCleanup = outside.destroy;
		}

		const ro = new ResizeObserver(schedulePosition);
		if (popoverState.buttonRef) ro.observe(popoverState.buttonRef);
		if (popover) ro.observe(popover);

		// These fire on document focus changes -- including the focusout that the
		// browser dispatches synchronously while the content is being removed from
		// the DOM. Defer the state write to a microtask so we never mutate
		// reactive state in the middle of the Svelte flush that unmounts us
		// (which throws state_unsafe_mutation). The DOM is read synchronously.
		const handleFocusIn = (e: FocusEvent) => {
			const target = e.target as HTMLElement;
			if (!target) return;

			const openPopovers = Array.from(
				document.querySelectorAll<HTMLElement>('[data-floating-content]')
			);
			const inside = openPopovers.some((el) => el.contains(target));
			queueMicrotask(() => {
				if (mounted) popoverState.focusedInside = inside;
			});
		};

		const handleFocusOut = () => {
			queueMicrotask(() => {
				if (mounted) popoverState.focusedInside = false;
			});
		};

		document.addEventListener('focusin', handleFocusIn);
		document.addEventListener('focusout', handleFocusOut);

		onDestroy(() => {
			mounted = false;
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('scroll', schedulePosition);
			window.removeEventListener('resize', schedulePosition);
			window.removeEventListener('scroll', schedulePosition, true);
			document.removeEventListener('focusin', handleFocusIn);
			document.removeEventListener('focusout', handleFocusOut);
			ro.disconnect();
			if (positionFrame !== undefined) cancelAnimationFrame(positionFrame);
			clickOutsideCleanup?.();
			popoverState.open = false;
			popoverState.popoverRef?.remove();
			popover?.remove();
		});
	});

	function cancelClose() {
		if (popoverState.closeTimeout) {
			if (popoverState.hoverable) {
				clearTimeout(popoverState.closeTimeout);
				popoverState.closeTimeout = undefined;
			}
		}
	}

	// Lock body scroll + inert background siblings whenever the popover is open.
	// Hoverable popovers (tooltip, hover-card) skip the lock because the
	// pointer-events-none on body children would kill mouseleave/mouseenter
	// on the trigger and cause an open/close flicker loop.
	$effect(() => {
		if (typeof document === 'undefined') return;
		if (popoverState.open && popover && !popoverState.hoverable && lockScroll) {
			acquireLock();
			return () => releaseLock();
		}
	});

	$effect(() => {
		if (!popoverState.hovering && !popoverState.focusedInside) {
			cancelClose();
		}
	});

	// Position the panel the moment it opens, before the browser paints. This
	// sets left/top *and* --popover-trigger-width synchronously, so the panel
	// never flashes at its (0,0) origin — the cause of the tooltip-swap jitter —
	// nor at auto width before snapping to the trigger (the combobox jump).
	// Without this we'd rely on the ResizeObserver firing a frame later.
	$effect(() => {
		if (popoverState.open && popover) {
			updatePosition();
		}
	});

	// Trap Tab focus inside the panel while open. Hoverable surfaces (tooltip,
	// hover-card) are excluded -- they aren't keyboard-modal and stealing focus
	// would fight their pointer-driven open/close.
	$effect(() => {
		if (popoverState.open && panelEl && !popoverState.hoverable && focusTrap) {
			const cleanup = trapFocus(panelEl);
			return cleanup;
		}
	});
</script>

<div
	role="presentation"
	data-floating-content
	class={cn(
		'fixed left-0 top-0 z-[130] flex max-w-[calc(100vw-2*var(--popover-viewport-margin))] max-h-[calc(100vh-2*var(--popover-viewport-margin))] items-center justify-center'
	)}
	bind:this={popover as HTMLElement}
	onmouseenter={cancelClose}
	onmouseleave={() => {
		if (popoverState.hoverable) {
			if (popover && popover.contains(document.activeElement)) {
				return;
			}
			popoverState.open = false;
		}
	}}
>
	{#if popoverState.open}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			{...rest}
			in:panelIn
			out:panelOut
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
				'm-auto flex origin-top-left flex-col overflow-hidden text-sm text-[var(--color-foreground)]',
				'bg-panel shadow-[var(--elevation-float)]',
				'max-w-[min(var(--popover-available-width,calc(100vw-2*var(--popover-viewport-margin))),calc(100vw-2*var(--popover-viewport-margin)))] max-h-[min(var(--popover-available-height,calc(100vh-2*var(--popover-viewport-margin))),calc(100vh-2*var(--popover-viewport-margin)))]',
				'rounded-[var(--radius-lg)] border border-border'
			)}
		>
			<!-- The inset surface: children live here, on the panel fill. -->
			<div class={cn(surfaceClass, 'min-h-0 flex-1 overflow-auto bg-panel p-3')}>
				{@render children?.()}
			</div>
		</div>
	{/if}
</div>
