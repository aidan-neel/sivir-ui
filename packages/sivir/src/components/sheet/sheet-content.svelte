<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { SheetContentProps } from '.';
	import { useOverlay } from '@sivir/ui/components/_internal/overlay';
	import { getCssDuration } from '@sivir/ui/internals/transition';
	import { fade, fly, type FlyParams } from 'svelte/transition';
	import { getSheetContext } from './context.svelte';

	let {
		class: className,
		allowClickOutside = true,
		children,
		side = 'right',
		...rest
	}: SheetContentProps = $props();

	const { id, state: sheetState } = getSheetContext();
	let element = $state<HTMLElement>();

	// Shared overlay behavior -- focus trap, click-outside, Escape, body lock.
	useOverlay({
		isOpen: () => sheetState.open,
		panelEl: () => element,
		onClose: () => {
			sheetState.open = false;
		},
		allowClickOutside: () => allowClickOutside,
		returnFocus: () => sheetState.triggerRef ?? undefined
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

{#if sheetState.open}
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
				// token-lint-disable-next-line no-literal-length
				`fixed top-2 bottom-2 z-50 flex w-[calc(100%-1rem)] max-w-sm flex-col overflow-hidden text-foreground shadow-[var(--elevation-float)] will-change-transform ${
					side === 'left' ? 'left-2' : 'right-2'
				}`,
				'rounded-[var(--radius-lg)] border border-border bg-panel'
			)}
			role="dialog"
			aria-modal="true"
			id={`sheet-${id}`}
			aria-labelledby={id + '-title'}
			aria-describedby={id + '-desc'}
			tabindex="-1"
			{...rest}
		>
			<!-- Inset surface: the sheet body lives here, on the panel fill. -->
			<div
				class={cn('flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-panel p-4')}
			>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
