<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import { type Snippet } from 'svelte';
	import { STATE_KEY } from './lib.svelte';

	let {
		children,
		class: classProp,
		...rest
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<p id={`${String(STATE_KEY)}-desc`} {...rest} class={cn(classProp, `text-foreground-muted`)}>
	{@render children?.()}
</p>
