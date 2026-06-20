<script lang="ts">
	import { flyAndScale, themedFade } from '@silk/ui/internals/transition';
	import { cn } from '@silk/ui/utils';
	import type { ModalContentProps, ModalState } from '.';
	import { getContext } from 'svelte';
	import { states, UIState } from '@silk/ui/internals/state.svelte.ts';
	import { useOverlay } from '@silk/ui/components/_internal/overlay';

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

{#if uiState.data.open}
	<div bind:this={portalEl} class="fixed inset-0 z-[115]">
		<div
			transition:themedFade={{ durationVar: '--motion-duration-overlay', fallback: 150 }}
			class={cn(
				overlayClass,
				'absolute inset-0 bg-[var(--color-overlay)] [backface-visibility:hidden] [transform:translateZ(0)]'
			)}
		></div>
		<div
			transition:flyAndScale={{ durationVar: '--motion-duration-panel' }}
			bind:this={element}
			class={cn(
				contentClass,
				className,
				'bg-[var(--color-modal)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[var(--panel-shadow)] flex flex-col gap-[var(--modal-section-gap)] p-[var(--modal-padding)] fixed top-[47%] left-1/2 z-[120] overflow-y-auto overscroll-contain -translate-x-1/2 -translate-y-1/2 m-auto md:w-full w-[calc(100%-var(--modal-margin-x))] max-w-[var(--modal-max-width)] min-h-[var(--modal-min-height)] max-h-[calc(100dvh-var(--modal-max-height-adjust))]'
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
{/if}
