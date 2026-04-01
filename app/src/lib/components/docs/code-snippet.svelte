<script lang="ts">
	import { cn } from '$lib/silk/utils';
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
		`bg-secondary font-mono text-foreground/90 text-xs rounded-md p-1 px-2`
	)}
>
	{@render children?.()}
</span>
