<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
		class?: string;
	};

	let { children, class: className, ...rest }: Props = $props();
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
