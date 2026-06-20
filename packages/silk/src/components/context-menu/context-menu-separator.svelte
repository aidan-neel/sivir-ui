<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import type { ContextMenuSeparatorProps } from '.';

	let { children, class: className, ...rest }: ContextMenuSeparatorProps = $props();
</script>

<div
	{...rest}
	data-ui="menu-separator"
	class={cn(
		className,
		'bg-[var(--separator-color)] rounded-[var(--radius-xl)] h-[var(--border-size)] w-[calc(100%-2*var(--menu-separator-margin-x))] mx-auto my-1'
	)}
>
	{@render children?.()}
</div>
