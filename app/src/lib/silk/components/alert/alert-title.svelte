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

<p
	{...rest}
	class={cn(classProp, `text font-medium tracking-[-0.02em] [font-family:var(--font-header),sans-serif]`)}
>
	{@render children?.()}
</p>
