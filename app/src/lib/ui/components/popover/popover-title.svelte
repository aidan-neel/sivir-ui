<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import { getContext, type Snippet } from 'svelte';

    const key = getContext("key") as string;

	let {
		children,
		class: classProp,
		...rest
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<p id={`${String(key)}-title`} {...rest} class={cn(classProp, `text-text text-lg text-foreground font-semibold`)}>
	{@render children?.()}
</p>
