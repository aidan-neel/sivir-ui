<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { ModalContentProps, ModalState } from '.';
	import { getContext } from 'svelte';
	import { states, type UIState } from '@sivir/ui/internals/state.svelte.ts';
	import { dialogIn, dialogOut, overlayIn, overlayOut } from '@sivir/ui/internals/transition';
	import { useOverlay } from '@sivir/ui/components/_internal/overlay';
	import X from '@lucide/svelte/icons/x';

	let {
		class: className,
		allowClickOutside = true,
		role = 'dialog',
		contentClass = '',
		overlayClass = '',
		surfaceClass = '',
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
			in:overlayIn
			out:overlayOut
			data-ui="modal-overlay"
			class={cn(
				overlayClass, // token-lint-disable-next-line no-literal-length
				'absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-[2px] [backface-visibility:hidden] [transform:translateZ(0)]'
			)}
		></div>
		<div
			in:dialogIn
			out:dialogOut
			bind:this={element}
			data-motion="dialog"
			class={cn(
				contentClass,
				className, // token-lint-disable-next-line no-literal-length
				'origin-center bg-[var(--color-panel)] text-[var(--color-foreground)] shadow-[var(--panel-shadow)]',
				'rounded-[var(--radius-lg)] border border-[var(--panel-border,var(--color-border))]',
				'fixed top-[45%] left-1/2 z-[120] m-auto min-h-[var(--modal-min-height)] w-[calc(100%-var(--modal-margin-x))] max-w-[var(--modal-max-width)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain md:w-full max-h-[calc(100dvh-var(--modal-max-height-adjust))]'
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
			<!-- Experiment: Modal.Content as a Panel. The box is Panel's outer frame;
			     this is its inset surface, themed with the modal's own tokens. -->
			<div
				class={cn(
					surfaceClass,
					'bg-[var(--color-panel)]',
					'relative flex h-full flex-col gap-[var(--modal-section-gap)] p-[var(--modal-padding)]'
				)}
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
	</div>
{/if}
