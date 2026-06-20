<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import { states, type UIState } from '@silk/ui/internals/state.svelte.ts';
	import { cn } from '@silk/ui/utils';
	import type { HoverCardTriggerProps } from '.';
	import type { PopoverState } from '@silk/ui/components/popover';

	let { class: className, children, href, ...rest }: HoverCardTriggerProps = $props();

	const key = getContext('key') as string;
	const uiState = states[key] as UIState<PopoverState>;
	let element = $state<HTMLElement>();

	function clearTimers() {
		if (uiState.data.hoverTimeout) {
			clearTimeout(uiState.data.hoverTimeout);
			uiState.data.hoverTimeout = undefined;
		}
		if (uiState.data.closeTimeout) {
			clearTimeout(uiState.data.closeTimeout);
			uiState.data.closeTimeout = undefined;
		}
	}

	function open() {
		clearTimers();
		const delay = uiState.data.delay ?? 0;
		uiState.data.hoverTimeout = setTimeout(() => {
			uiState.data.open = true;
			uiState.data.hovering = true;
		}, delay);
	}

	function close() {
		clearTimers();
		// Use --motion-duration-panel (default 180ms) for close delay consistency with panel motion
		const closeDelay = uiState.data.closeDelay ?? 180;
		uiState.data.closeTimeout = setTimeout(() => {
			uiState.data.open = false;
			uiState.data.hovering = false;
		}, closeDelay);
	}

	onMount(() => {
		uiState.data.buttonRef = element ?? null;
	});

	onDestroy(clearTimers);
</script>

{#if href}
	<a
		bind:this={element as HTMLAnchorElement}
		{href}
		onmouseenter={open}
		onmouseleave={close}
		onfocus={open}
		onblur={close}
		class={cn(
			'underline decoration-foreground-muted underline-offset-2 hover:decoration-foreground',
			className
		)}
		{...rest}
	>
		{@render children?.()}
	</a>
{:else}
	<span
		bind:this={element}
		onmouseenter={open}
		onmouseleave={close}
		onfocus={open}
		onblur={close}
		tabindex="0"
		class={cn('inline-flex', className)}
		{...rest}
	>
		{@render children?.()}
	</span>
{/if}
