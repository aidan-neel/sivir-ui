<script lang="ts">
	import { flyNoOpacity } from '$lib/silk/internals/transition';
	import { clickOutside, cn, getFocusableElements, trapFocus } from '$lib/silk/utils';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import type { SheetContentProps, SheetState } from '.';
	import { getContext } from 'svelte';
	import { states, UIState } from '$lib/silk/internals/state.svelte.ts';

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

	let cleanup: (() => void) | undefined;
	const isLeft = $derived(side === 'left');

	$effect(() => {
		if (typeof document === 'undefined') return;

		if (uiState.data.open) {
			cleanup = trapFocus(element as HTMLElement, {
				initialFocus: getFocusableElements(element as HTMLElement)[0] ?? null
			});
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
			cleanup?.();
			cleanup = undefined;
		}
	});
</script>

{#if uiState.data.open}
	<div class="fixed inset-0 z-40 overflow-hidden">
		<div
			transition:fade={{ duration: 150, easing: cubicOut }}
			class="absolute inset-0 bg-[var(--color-overlay)] [backface-visibility:hidden] [transform:translateZ(0)]"
			style="backdrop-filter: blur(var(--motion-overlay-blur));"
		></div>
		<div
			bind:this={element}
			transition:flyNoOpacity={{
				xVar: '--motion-sheet-offset',
				xMultiplier: side === 'left' ? -1 : 1,
				y: 0,
				durationVar: '--motion-duration-sheet'
			}}
			data-ui="sheet-content"
			class={cn(
				className,
				`bg-[var(--color-panel)] shadow-[var(--panel-shadow)] p-[var(--panel-padding-lg)] transition-all fixed top-0 z-50 m-auto flex h-[100dvh] w-full max-w-[25rem] flex-col overflow-y-auto overscroll-contain ${
					isLeft
						? 'left-0 border-r border-border'
						: 'right-0 border-l border-border'
				}`
			)}
			use:clickOutside={() => {
				if (allowClickOutside) {
					uiState.data.open = false;
				}
			}}
			onkeydown={(event) => {
				if (event.key === 'Escape') {
					event.preventDefault();
					uiState.data.open = false;
				}
			}}
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
