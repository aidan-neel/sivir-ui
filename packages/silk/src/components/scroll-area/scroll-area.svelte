<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { ScrollAreaProps } from '.';

	let { class: className, children, orientation = 'vertical', ...rest }: ScrollAreaProps = $props();

	let scroller = $state<HTMLDivElement | undefined>();
	let scrollTop = $state(0);
	let scrollHeight = $state(0);
	let clientHeight = $state(0);

	const atTop = $derived(scrollTop <= 1);
	const atBottom = $derived(scrollTop + clientHeight >= scrollHeight - 1);
	const overflows = $derived(scrollHeight - clientHeight > 1);
	const showCues = $derived(orientation === 'vertical' && overflows);

	function measure() {
		if (!scroller) return;
		scrollTop = scroller.scrollTop;
		scrollHeight = scroller.scrollHeight;
		clientHeight = scroller.clientHeight;
	}

	// Measure on mount + whenever content/viewport size changes, so the edge
	// cues are correct before the first scroll event fires.
	$effect(() => {
		if (!scroller) return;
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(scroller);
		for (const child of Array.from(scroller.children)) ro.observe(child);
		return () => ro.disconnect();
	});
</script>

<div
	bind:this={scroller}
	data-ui="scroll-area"
	data-orientation={orientation}
	class={cn(
		className,
		'silk-scroll relative overscroll-contain p-1',
		orientation === 'horizontal'
			? 'overflow-x-auto overflow-y-hidden'
			: 'overflow-y-auto overflow-x-hidden'
	)}
	onscroll={measure}
	{...rest}
>
	{#if showCues}
		<!-- Top edge cue: sticky so it pins to the top of the scrollport. -->
		<div aria-hidden="true" class="sticky top-0 z-10 h-0">
			<div
				class="pointer-events-none absolute inset-x-0 top-0 flex h-7 items-start justify-center transition-opacity duration-150"
				style="opacity: {atTop
					? 0
					: 1}; background: linear-gradient(to bottom, color-mix(in srgb, var(--color-panel, #fff) 92%, transparent), transparent);"
			>
				<ChevronUp size={13} class="mt-0.5 text-foreground-muted" />
			</div>
		</div>
	{/if}

	{@render children?.()}

	{#if showCues}
		<!-- Bottom edge cue: sticky so it pins to the bottom of the scrollport. -->
		<div aria-hidden="true" class="sticky bottom-0 z-10 h-0">
			<div
				class="pointer-events-none absolute inset-x-0 bottom-0 flex h-7 items-end justify-center transition-opacity duration-150"
				style="opacity: {atBottom
					? 0
					: 1}; background: linear-gradient(to top, color-mix(in srgb, var(--color-panel, #fff) 92%, transparent), transparent);"
			>
				<ChevronDown size={13} class="mb-0.5 text-foreground-muted" />
			</div>
		</div>
	{/if}
</div>

<style>
	/* Custom themed scrollbar. Falls back to native on unsupported browsers. */
	.silk-scroll {
		scrollbar-width: thin;
		scrollbar-color: color-mix(in srgb, var(--color-foreground) 22%, transparent) transparent;
	}
	.silk-scroll::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}
	.silk-scroll::-webkit-scrollbar-track {
		background: transparent;
	}
	.silk-scroll::-webkit-scrollbar-thumb {
		background: color-mix(in srgb, var(--color-foreground) 18%, transparent);
		border: 2px solid transparent;
		background-clip: padding-box;
		border-radius: 9999px;
	}
	.silk-scroll::-webkit-scrollbar-thumb:hover {
		background: color-mix(in srgb, var(--color-foreground) 32%, transparent);
		background-clip: padding-box;
	}
</style>
