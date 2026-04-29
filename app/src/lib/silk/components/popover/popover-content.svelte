<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import { clickOutside, cn, positionFloatingPanel } from '$lib/silk/utils';
	import { flyAndScale } from '$lib/silk/internals/transition';
	import { getContext } from 'svelte';
	import type { ReferenceElement } from '@floating-ui/dom';
	import type { PopoverContentProps, PopoverState } from '.';

	const {
		children,
		class: classProp,
		allowClickOutside = true,
		portal = true,
		refElement,
		lockBody = false,
		role = 'dialog',
		tabindex = -1,
		id,
		...rest
	}: PopoverContentProps = $props();

	const key = getContext('key') as string;
	const uiState = states[key].data as PopoverState;

	let popover = $state<HTMLElement | undefined>();
	let clickOutsideCleanup: (() => void) | undefined;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			uiState.open = false;
		}
	}

	function updatePosition() {
		if (uiState && popover) {
			const triggerWidth = uiState.buttonRef?.getBoundingClientRect().width;
			if (triggerWidth) {
				popover.style.setProperty('--popover-trigger-width', `${triggerWidth}px`);
			}

			positionFloatingPanel(
				refElement ?? (uiState.buttonRef as ReferenceElement),
				popover,
				refElement ? 'right-start' : uiState.placement
			);
		}
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

		const handleFocusIn = (e: FocusEvent) => {
			const target = e.target as HTMLElement;
			if (!target) return;

			const openPopovers = Array.from(document.body.children).filter(
				(el) => el.id.startsWith('popover-') && !el.id.includes('controls')
			);
			uiState.focusedInside = openPopovers.some((el) => el.contains(target));
		};

		const handleFocusOut = () => {
			uiState.focusedInside = false;
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

	$effect(() => {
		if (!document) return;

		const bodyChildren = Array.from(document.body.children) as HTMLElement[];

		if (lockBody && uiState.open) {
			document.body.style.overflow = 'hidden';
			for (const el of bodyChildren) {
				if (!el.id.startsWith('popover-') || el.id.includes('controls')) {
					el.classList.add('pointer-events-none');
				}
			}
		} else {
			document.body.style.overflow = '';
			for (const el of bodyChildren) {
				el.classList.remove('pointer-events-none');
			}
		}

		if (!uiState.hovering && !uiState.focusedInside) {
			cancelClose();
		}
	});
</script>

<div
	role="presentation"
	data-floating-content
	class={cn('absolute left-0 top-0 z-[130] flex max-w-[calc(100vw-1rem)] max-h-[calc(100vh-1rem)] items-center justify-center')}
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
	{#if uiState?.open}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			{...rest}
			id={id ?? `popover-${String(key)}-content`}
			{role}
			aria-modal="false"
			aria-labelledby={`popover-${String(key)}-title`}
			{tabindex}
			transition:flyAndScale={{ durationVar: '--motion-duration-panel' }}
			data-ui="popover-content"
			class={cn(
				classProp,
				`bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-outlined p-[var(--panel-padding)] text-sm m-auto max-w-[min(var(--popover-available-width,calc(100vw-1rem)),calc(100vw-1rem))] max-h-[min(var(--popover-available-height,calc(100vh-1rem)),calc(100vh-1rem))] overflow-auto`
			)}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
