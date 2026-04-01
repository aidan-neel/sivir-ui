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

<h1
	{...rest}
	class={cn(classProp, `py-1 text-base font-medium tracking-[-0.02em] text-foreground [font-family:var(--font-header),sans-serif]`)}
>
	{@render children?.()}
</h1>
