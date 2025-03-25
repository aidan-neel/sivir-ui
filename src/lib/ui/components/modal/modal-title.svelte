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

<h3
	{...rest}
	id={`${String(STATE_KEY)}-title`}
	class={cn(classProp, `text-foreground font-semibold my-1`)}
>
	{@render children?.()}
</h3>
