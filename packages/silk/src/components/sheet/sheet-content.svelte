<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import type { SheetContentProps, SheetState } from '.';
	import { getContext } from 'svelte';
	import { states, UIState } from '@silk/ui/internals/state.svelte.ts';
	import { useOverlay } from '@silk/ui/components/_internal/overlay';

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

	// `visible` stays true through the closing animation so we can run the
	// outro before unmounting. It only flips to false after `animationend`.
	let visible = $state(false);

	$effect(() => {
		if (uiState.data.open) visible = true;
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

	function onAnimationEnd(event: AnimationEvent) {
		// Only react to the panel's own slide animation, not bubbled child anims.
		if (event.target !== element) return;
		if (!uiState.data.open) visible = false;
	}
</script>

{#if visible}
	<div class="silk-sheet-root" data-state={uiState.data.open ? 'open' : 'closed'}>
		<div class="silk-sheet-backdrop" aria-hidden="true"></div>
		<div
			bind:this={element}
			data-ui="sheet-content"
			data-side={side}
			onanimationend={onAnimationEnd}
			class={cn(
				className,
				`silk-sheet-panel bg-[var(--color-modal)] text-[var(--color-panel-foreground)] shadow-[var(--panel-shadow)] p-[var(--sheet-body-padding)] border border-border rounded-[var(--radius-lg)] fixed top-[var(--sheet-margin)] bottom-[var(--sheet-margin)] z-50 flex w-[calc(100%-calc(var(--sheet-margin)*2))] max-w-[var(--sheet-max-width)] flex-col overflow-y-auto overscroll-contain ${
					side === 'left' ? 'left-[var(--sheet-margin)]' : 'right-[var(--sheet-margin)]'
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

<style>
	.silk-sheet-root {
		position: fixed;
		inset: 0;
		z-index: 40;
		pointer-events: none;
	}
	.silk-sheet-root > * {
		pointer-events: auto;
	}

	.silk-sheet-backdrop {
		position: absolute;
		inset: 0;
		background: var(--color-overlay);
		backdrop-filter: blur(var(--motion-overlay-blur));
		-webkit-backdrop-filter: blur(var(--motion-overlay-blur));
		animation: silk-sheet-backdrop-in var(--motion-duration-overlay, 150ms) ease-out both;
	}

	.silk-sheet-panel {
		animation-duration: var(--motion-duration-sheet, 320ms);
		animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
		animation-fill-mode: both;
		will-change: transform;
	}
	.silk-sheet-panel[data-side='right'] {
		animation-name: silk-sheet-slide-in-right;
	}
	.silk-sheet-panel[data-side='left'] {
		animation-name: silk-sheet-slide-in-left;
	}

	.silk-sheet-root[data-state='closed'] .silk-sheet-backdrop {
		animation: silk-sheet-backdrop-out var(--motion-duration-overlay, 150ms) ease-in both;
	}
	.silk-sheet-root[data-state='closed'] .silk-sheet-panel[data-side='right'] {
		animation-name: silk-sheet-slide-out-right;
	}
	.silk-sheet-root[data-state='closed'] .silk-sheet-panel[data-side='left'] {
		animation-name: silk-sheet-slide-out-left;
	}

	@keyframes silk-sheet-slide-in-right {
		from {
			transform: translate3d(calc(100% + 1rem), 0, 0);
		}
		to {
			transform: translate3d(0, 0, 0);
		}
	}
	@keyframes silk-sheet-slide-out-right {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(calc(100% + 1rem), 0, 0);
		}
	}
	@keyframes silk-sheet-slide-in-left {
		from {
			transform: translate3d(calc(-100% - 1rem), 0, 0);
		}
		to {
			transform: translate3d(0, 0, 0);
		}
	}
	@keyframes silk-sheet-slide-out-left {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(calc(-100% - 1rem), 0, 0);
		}
	}
	@keyframes silk-sheet-backdrop-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes silk-sheet-backdrop-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.silk-sheet-panel,
		.silk-sheet-backdrop {
			animation-duration: 1ms !important;
		}
	}
</style>
