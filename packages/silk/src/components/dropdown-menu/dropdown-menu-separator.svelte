<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import { cn } from '@silk/ui/utils';
	import { getContext, type Snippet } from 'svelte';

	const key = getContext('key');

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
