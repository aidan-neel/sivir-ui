<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import { type Snippet } from 'svelte';

	let {
		children,
		class: classProp,
		...rest
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div
	data-ui="card"
	{...rest}
	class={cn(
		classProp,
		`bg-[var(--card-bg)] border border-border rounded-[var(--radius-lg)] p-[var(--card-padding)] shadow-[var(--card-shadow)] flex flex-col`
	)}
>
	{@render children?.()}
</div>
