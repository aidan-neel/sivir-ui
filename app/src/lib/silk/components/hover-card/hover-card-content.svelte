<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { states, UIState } from '$lib/silk/internals/state.svelte.ts';
	import { cn, positionFloatingPanel } from '$lib/silk/utils';
	import { flyAndScale } from '$lib/silk/internals/transition';
	import type { HoverCardContentProps, HoverCardState } from '.';
	import type { ReferenceElement } from '@floating-ui/dom';

	let {
		class: className,
		children,
		side = 'bottom',
		align = 'center',
		...rest
	}: HoverCardContentProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<HoverCardState>;
	let panel = $state<HTMLElement>();

	function placement() {
		return `${side}-${align}` as Parameters<typeof positionFloatingPanel>[2];
	}

	function reposition() {
		if (!panel || !uiState.data.triggerRef) return;
		positionFloatingPanel(uiState.data.triggerRef as ReferenceElement, panel, placement());
	}

	function cancelClose() {
		if (uiState.data.closeTimer) {
			clearTimeout(uiState.data.closeTimer);
			uiState.data.closeTimer = undefined;
		}
	}
	function scheduleClose() {
		if (uiState.data.closeTimer) return;
		uiState.data.closeTimer = window.setTimeout(() => {
			uiState.data.open = false;
			uiState.data.closeTimer = undefined;
		}, uiState.data.closeDelay);
	}

	// Single onMount with a cleanup return guarantees the removeEventListener
	// only runs on the client (where addEventListener actually fired).
	onMount(() => {
		window.addEventListener('resize', reposition);
		window.addEventListener('scroll', reposition, true);
		return () => {
			window.removeEventListener('resize', reposition);
			window.removeEventListener('scroll', reposition, true);
		};
	});

	$effect(() => {
		if (uiState.data.open && panel) {
			uiState.data.contentRef = panel;
			reposition();
		}
	});
</script>

{#if uiState.data.open}
	<div
		bind:this={panel}
		role="dialog"
		data-ui="hover-card-content"
		transition:flyAndScale={{ durationVar: '--motion-duration-panel' }}
		onmouseenter={cancelClose}
		onmouseleave={scheduleClose}
		class={cn(
			'fixed left-0 top-0 z-[130] w-64 rounded-[var(--radius-lg)] border border-border bg-[var(--color-panel)] p-3 text-[0.86rem] text-[var(--color-panel-foreground)] shadow-outlined',
			className
		)}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
