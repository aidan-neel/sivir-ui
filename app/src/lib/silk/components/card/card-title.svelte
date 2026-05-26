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
	class={cn(classProp, `py-1 text-base [font-weight:var(--font-weight-header,600)] tracking-[-0.02em] text-foreground`)}
>
	{@render children?.()}
</h1>
