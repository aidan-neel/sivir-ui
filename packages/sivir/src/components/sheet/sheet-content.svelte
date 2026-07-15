<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { SheetContentProps, SheetState } from '.';
	import { getContext } from 'svelte';
	import { states, type UIState } from '@sivir/ui/internals/state.svelte.ts';
	import { useOverlay } from '@sivir/ui/components/_internal/overlay';
	import { getCssDuration } from '@sivir/ui/internals/transition';
	import { fade, fly, type FlyParams } from 'svelte/transition';

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

	// Shared overlay behavior -- focus trap, click-outside, Escape, body lock.
	useOverlay({
		isOpen: () => uiState.data.open,
		panelEl: () => element,
		onClose: () => {
			uiState.data.open = false;
		},
		allowClickOutside: () => allowClickOutside
	});

	function sheetFly(node: Element, params: FlyParams) {
		return fly(node, {
			...params,
			duration: getCssDuration(node, '--motion-duration-sheet', 220)
		});
	}

	function backdropFade(node: Element) {
		return fade(node, {
			duration: getCssDuration(node, '--motion-duration-overlay', 150)
		});
	}
</script>

{#if uiState.data.open}
	<div class="pointer-events-none fixed inset-0 z-40 [&>*]:pointer-events-auto">
		<div
			in:backdropFade
			out:backdropFade
			data-ui="sheet-overlay"
			class="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm [backface-visibility:hidden] [transform:translateZ(0)]"
			aria-hidden="true"
		></div>
		<div
			bind:this={element}
			data-ui="sheet-content"
			data-side={side}
			in:sheetFly={{ x: side === 'left' ? 'calc(-100% - 1rem)' : 'calc(100% + 1rem)' }}
			out:sheetFly={{ x: side === 'left' ? 'calc(-100% - 1rem)' : 'calc(100% + 1rem)' }}
			class={cn(
				className,
				`fixed top-[var(--sheet-margin)] bottom-[var(--sheet-margin)] z-50 flex w-[calc(100%-calc(var(--sheet-margin)*2))] max-w-[var(--sheet-max-width)] flex-col overflow-hidden text-[var(--color-foreground)] shadow-[var(--panel-shadow)] will-change-transform ${
					side === 'left' ? 'left-[var(--sheet-margin)]' : 'right-[var(--sheet-margin)]'
				}`,
				'rounded-[var(--radius-lg)] border border-[var(--panel-border,var(--color-border))] bg-[var(--color-panel)]'
			)}
			role="dialog"
			aria-modal="true"
			id={`sheet-${uiState.key}`}
			aria-labelledby={uiState.key + '-title'}
			aria-describedby={uiState.key + '-desc'}
			tabindex="-1"
			{...rest}
		>
			<!-- Inset surface: the sheet body lives here, on the panel fill. -->
			<div
				class={cn(
					'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-[var(--color-panel)] p-[var(--sheet-body-padding)]'
				)}
			>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
