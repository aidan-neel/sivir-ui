<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import type { ModalContentProps, ModalState } from '.';
	import { getContext } from 'svelte';
	import { states, UIState } from '@silk/ui/internals/state.svelte.ts';
	import { useOverlay } from '@silk/ui/components/_internal/overlay';
	import { usePresence } from '@silk/ui/internals/presence.svelte.ts';

	let {
		class: className,
		allowClickOutside = true,
		role = 'dialog',
		contentClass = '',
		overlayClass = '',
		panelIdPrefix = 'modal',
		children,
		...rest
	}: ModalContentProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<ModalState>;
	let element = $state<HTMLElement>();
	let portalEl = $state<HTMLDivElement>();

	// Keep the modal mounted through its CSS exit animation.
	const presence = usePresence(
		() => uiState.data.open,
		() => element
	);

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

{#if presence.present}
	<div bind:this={portalEl} class="fixed inset-0 z-[115]">
		<div
			data-ui="overlay-backdrop"
			data-state={presence.status}
			class={cn(
				overlayClass,
				'absolute inset-0 bg-[var(--color-overlay)] [backface-visibility:hidden] [transform:translateZ(0)]'
			)}
		></div>
		<!-- Flex centering wrapper: the panel animates its own transform without
		     clobbering a translate-based centering. -->
		<div class="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center p-3">
			<div
				bind:this={element}
				data-ui="dialog-content"
				data-state={presence.status}
				class={cn(
					contentClass,
					className,
					'pointer-events-auto bg-[var(--color-overlay-bg)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[var(--panel-shadow)] flex flex-col gap-[var(--modal-section-gap,16px)] p-[var(--modal-padding,16px)] overflow-y-auto overscroll-contain md:w-full w-full max-w-[35rem] min-h-[5rem] max-h-[calc(100dvh-2rem)]'
				)}
				{role}
				aria-modal="true"
				id={`${panelIdPrefix}-${uiState.key}`}
				aria-labelledby={uiState.key + '-title'}
				aria-describedby={uiState.key + '-desc'}
				tabindex="-1"
				{...rest}
			>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
