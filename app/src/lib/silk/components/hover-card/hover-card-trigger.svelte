<script lang="ts">
	import { getContext } from 'svelte';
	import { states, UIState } from '$lib/silk/internals/state.svelte.ts';
	import { cn } from '$lib/silk/utils';
	import type { HoverCardTriggerProps, HoverCardState } from '.';

	let { class: className, children, href, ...rest }: HoverCardTriggerProps = $props();
	const key = getContext<string>('key');
	const uiState = states[key] as UIState<HoverCardState>;
	let el = $state<HTMLElement>();

	function scheduleOpen() {
		if (uiState.data.closeTimer) {
			clearTimeout(uiState.data.closeTimer);
			uiState.data.closeTimer = undefined;
		}
		if (uiState.data.openTimer) return;
		uiState.data.openTimer = window.setTimeout(() => {
			uiState.data.open = true;
			uiState.data.openTimer = undefined;
		}, uiState.data.openDelay);
	}
	function scheduleClose() {
		if (uiState.data.openTimer) {
			clearTimeout(uiState.data.openTimer);
			uiState.data.openTimer = undefined;
		}
		if (uiState.data.closeTimer) return;
		uiState.data.closeTimer = window.setTimeout(() => {
			uiState.data.open = false;
			uiState.data.closeTimer = undefined;
		}, uiState.data.closeDelay);
	}

	$effect(() => {
		if (el) uiState.data.triggerRef = el;
	});
</script>

{#if href}
	<a
		bind:this={el as HTMLAnchorElement}
		{href}
		onmouseenter={scheduleOpen}
		onmouseleave={scheduleClose}
		onfocus={scheduleOpen}
		onblur={scheduleClose}
		class={cn('underline decoration-foreground-muted underline-offset-2 hover:decoration-foreground', className)}
		{...rest}
	>
		{@render children?.()}
	</a>
{:else}
	<span
		bind:this={el}
		onmouseenter={scheduleOpen}
		onmouseleave={scheduleClose}
		onfocus={scheduleOpen}
		onblur={scheduleClose}
		tabindex="0"
		class={cn('inline-flex', className)}
		{...rest}
	>
		{@render children?.()}
	</span>
{/if}
