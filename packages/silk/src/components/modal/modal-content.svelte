<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import type { ModalContentProps, ModalState } from '.';
	import { getContext } from 'svelte';
	import { states, UIState } from '@silk/ui/internals/state.svelte.ts';
	import { createPresence } from '@silk/ui/internals/presence.svelte.ts';
	import { useOverlay } from '@silk/ui/components/_internal/overlay';
	import X from '@lucide/svelte/icons/x';

	let {
		class: className,
		allowClickOutside = true,
		role = 'dialog',
		contentClass = '',
		overlayClass = '',
		panelIdPrefix = 'modal',
		showClose = true,
		size = 'md',
		children,
		...rest
	}: ModalContentProps = $props();

	// Rebind --modal-max-width for this panel to the chosen size token. A style
	// directive (vs a class) sets the property directly, so it can't be dropped
	// by class merging and survives the {...rest} spread.
	const maxWidth = $derived(`var(--modal-width-${size})`);

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<ModalState>;
	let element = $state<HTMLElement>();
	let portalEl = $state<HTMLDivElement>();

	// Keep the modal mounted through its CSS exit animation.
	const presence = createPresence(() => uiState.data.open);

	// Portal the modal to <body> so its z-index escapes ancestor stacking
	// contexts (e.g. flex items with z-index, transformed parents, etc.).
	$effect(() => {
		if (!portalEl || typeof document === 'undefined') return;
		document.body.appendChild(portalEl);
		return () => {
			portalEl?.remove();
		};
	});

	// Shared overlay behavior -- focus trap, click-outside, Escape, body lock.
	useOverlay({
		isOpen: () => uiState.data.open,
		panelEl: () => element,
		onClose: () => {
			uiState.data.open = false;
		},
		allowClickOutside: () => allowClickOutside
	});
</script>

{#if presence.mounted}
	<div bind:this={portalEl} class="fixed inset-0 z-[115]">
		<div
			data-silk-anim="overlay"
			data-state={presence.state}
			class={cn(
				overlayClass,
				'absolute inset-0 bg-[var(--silk-neutral-50)]/30 backdrop-blur-[6px] [backface-visibility:hidden] [transform:translateZ(0)]'
			)}
		></div>
		<div
			data-silk-anim="panel"
			data-state={presence.state}
			onanimationend={presence.end}
			bind:this={element}
			class={cn(
				contentClass,
				className,
				'[--motion-panel-origin:center] [--motion-panel-y:0px] [--motion-panel-scale-start:0.92] bg-[var(--color-modal)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[var(--panel-shadow)] flex flex-col gap-[var(--modal-section-gap)] p-[var(--modal-padding)] fixed top-[45%] left-1/2 z-[120] overflow-y-auto overscroll-contain -translate-x-1/2 -translate-y-1/2 m-auto md:w-full w-[calc(100%-var(--modal-margin-x))] max-w-[var(--modal-max-width)] min-h-[var(--modal-min-height)] max-h-[calc(100dvh-var(--modal-max-height-adjust))]'
			)}
			style:--modal-max-width={maxWidth}
			{role}
			aria-modal="true"
			id={`${panelIdPrefix}-${uiState.key}`}
			aria-labelledby={uiState.key + '-title'}
			aria-describedby={uiState.key + '-desc'}
			tabindex="-1"
			{...rest}
		>
			{#if showClose}
				<button
					onclick={() => {
						uiState.data.open = false;
					}}
					aria-label="Close"
					class="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-[var(--radius-md)] text-foreground-muted hover:bg-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
				>
					<X size={16} />
				</button>
			{/if}
			{@render children?.()}
		</div>
	</div>
{/if}
