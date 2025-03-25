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

<div {...rest} class={cn(classProp, `px-6 pb-6`)}>
	{@render children?.()}
</div>
