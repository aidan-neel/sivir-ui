<script lang="ts">
	import { cn } from '$lib/ui/utils';
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

<span
	{...rest}
	class={cn(
		classProp,
		`bg-secondary border font-mono text-foreground/90 text-xs rounded-lg-md p-0.5 px-1`
	)}
>
	{@render children?.()}
</span>
