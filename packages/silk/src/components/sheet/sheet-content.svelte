<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import type { SheetContentProps, SheetState } from '.';
	import { getContext } from 'svelte';
	import { states, UIState } from '@silk/ui/internals/state.svelte.ts';
	import { useOverlay } from '@silk/ui/components/_internal/overlay';
	import { usePresence } from '@silk/ui/internals/presence.svelte.ts';

	let {
		class: className,
		allowClickOutside = true,
		children,
		side = 'right',
		...rest
	}: SheetContentProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<SheetState>;
	let element = $state<HTMLElement>();

	// Keep the sheet mounted through its CSS exit animation.
	const presence = usePresence(
		() => uiState.data.open,
		() => element
	);

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
	<div class="pointer-events-none fixed inset-0 z-40 [&>*]:pointer-events-auto">
		<div
			data-ui="overlay-backdrop"
			data-state={presence.status}
			aria-hidden="true"
			class="absolute inset-0 bg-[var(--color-overlay)]"
		></div>
		<div
			bind:this={element}
			data-ui="sheet-content"
			data-side={side}
			data-state={presence.status}
			class={cn(
				className,
				`bg-[var(--color-overlay-bg)] text-[var(--color-foreground)] shadow-[var(--panel-shadow)] p-[var(--sheet-body-padding,16px)] border border-border rounded-[var(--radius-lg)] fixed top-2 bottom-2 z-50 flex w-[calc(100%-1rem)] max-w-[25rem] flex-col overflow-y-auto overscroll-contain ${
					side === 'left' ? 'left-2' : 'right-2'
				}`
			)}
			role="dialog"
			aria-modal="true"
			id={`sheet-${uiState.key}`}
			aria-labelledby={uiState.key + '-title'}
			aria-describedby={uiState.key + '-desc'}
			tabindex="-1"
			{...rest}
		>
			{@render children?.()}
		</div>
	</div>
{/if}
