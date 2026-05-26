<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import type { ScrollAreaProps } from '.';

	let {
		class: className,
		children,
		orientation = 'vertical',
		...rest
	}: ScrollAreaProps = $props();
</script>

<div
	data-ui="scroll-area"
	data-orientation={orientation}
	class={cn(
		'silk-scroll relative',
		orientation === 'horizontal' ? 'overflow-x-auto overflow-y-hidden' : 'overflow-y-auto overflow-x-hidden',
		'overscroll-contain',
		className
	)}
	{...rest}
>
	{@render children?.()}
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
