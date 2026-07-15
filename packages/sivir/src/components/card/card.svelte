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
		'flex flex-col rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-[var(--elevation-1)]'
	)}
>
	{@render children?.()}
</div>
