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

<h1
	{...rest}
	class={cn(classProp, `font-semibold py-1 text-base text-foreground`)}
>
	{@render children?.()}
</h1>
