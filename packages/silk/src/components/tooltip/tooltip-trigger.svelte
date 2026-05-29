<script lang="ts">
	import { getContext, onMount, onDestroy, type Snippet } from 'svelte';
	import { states, type UIState } from '@silk/ui/internals/state.svelte.ts';
	import { cn } from '@silk/ui/utils';
	import type { PopoverState } from '@silk/ui/components/popover';

	const key = getContext('key') as string;
	const uiState = states[key] as UIState<PopoverState>;

	let element = $state<HTMLElement>();

	const { children, class: className }: { children?: Snippet; class?: string } = $props();

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
		const closeDelay = uiState.data.closeDelay ?? 150;
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

<span
	bind:this={element}
	role="presentation"
	aria-describedby={uiState.data.open ? `popover-${String(key)}-content` : undefined}
	onmouseenter={open}
	onmouseleave={close}
	onfocusin={open}
	onfocusout={close}
	class={cn(className, 'inline-flex')}
>
	{@render children?.()}
</span>
