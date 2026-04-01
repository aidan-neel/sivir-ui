<script lang="ts">
	import { getContext, onDestroy, tick, type Snippet } from 'svelte';
	import { cn } from '$lib/silk/utils';

	type TooltipContext = {
		id: string;
		open: boolean;
		delay: number;
		closeDelay: number;
		placement: 'top' | 'left' | 'bottom' | 'right';
		triggerEl?: HTMLElement;
		contentEl?: HTMLElement;
		openTimeout?: ReturnType<typeof setTimeout>;
		closeTimeout?: ReturnType<typeof setTimeout>;
	};

	const tooltipState = getContext<TooltipContext>('tooltip');

	let element: HTMLSpanElement | undefined = $state();

	const {
		children,
		class: className
	}: {
		children?: Snippet;
		class?: string;
	} = $props();

	function clearTimers() {
		if (tooltipState.openTimeout) clearTimeout(tooltipState.openTimeout);
		if (tooltipState.closeTimeout) clearTimeout(tooltipState.closeTimeout);
		tooltipState.openTimeout = undefined;
		tooltipState.closeTimeout = undefined;
	}

	async function openTooltip() {
		clearTimers();
		tooltipState.openTimeout = setTimeout(async () => {
			tooltipState.open = true;
			await tick();
		}, tooltipState.delay);
	}

	function closeTooltip() {
		clearTimers();
		tooltipState.closeTimeout = setTimeout(() => {
			tooltipState.open = false;
		}, tooltipState.closeDelay);
	}

	$effect(() => {
		tooltipState.triggerEl = element;
	});

	onDestroy(() => {
		clearTimers();
	});
</script>

<span
	bind:this={element}
	class={cn(className, 'inline-flex')}
	onmouseenter={openTooltip}
	onmouseleave={closeTooltip}
	onfocusin={openTooltip}
	onfocusout={closeTooltip}
	role="presentation"
	aria-describedby={tooltipState.open ? tooltipState.id : undefined}
>
	{@render children?.()}
</span>
