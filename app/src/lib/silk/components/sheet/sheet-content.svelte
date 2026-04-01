<script lang="ts">
	import { flyNoOpacity } from '$lib/silk/internals/transition';
	import { clickOutside, type DefaultProps, cn, trapFocus } from '$lib/silk/utils';
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
			cleanup = trapFocus(element as HTMLElement);
			document.body.style.overflow = 'hidden';
			const focusable = element?.querySelector<HTMLElement>(
				'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
			);
			focusable?.focus();
		} else {
			document.body.style.overflow = '';
			cleanup?.();
			cleanup = undefined;
		}
	});
</script>

{#if uiState.data.open}
	<div
		transition:fade={{ duration: 150, easing: cubicOut }}
		class="fixed inset-0 z-40 bg-[var(--color-overlay)] backdrop-blur-[2px]"
	></div>
	<div
		bind:this={element}
		transition:flyNoOpacity={{
			x: side === 'left' ? -125 : 125,
			y: 0,
			durationVar: '--motion-duration-sheet'
		}}
		data-ui="sheet-content"
		class={cn(
			className,
			`bg-[var(--color-panel)] shadow-[var(--panel-shadow)] p-[var(--panel-padding-lg)] transition-all fixed top-0 z-50 m-auto flex h-screen w-full max-w-[25rem] flex-col overflow-y-auto ${
				isLeft
					? 'left-0 border-r border-[var(--panel-border)]'
					: 'right-0 border-l border-[var(--panel-border)]'
			}`
		)}
		use:clickOutside={() => {
			if (allowClickOutside) {
				uiState.data.open = false;
			}
		}}
		role="dialog"
		aria-modal="true"
		aria-labelledby={uiState.key + '-title'}
		aria-describedby={uiState.key + '-desc'}
		tabindex="-1"
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
