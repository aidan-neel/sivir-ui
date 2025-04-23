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

<p {...rest} class={cn(classProp, `text-sm text-foreground-muted`)}>
	{@render children?.()}
</p>
