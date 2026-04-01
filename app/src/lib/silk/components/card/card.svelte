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

<div data-ui="card" {...rest} class={cn(classProp, `bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] p-[var(--card-padding)] flex flex-col`)}>
	{@render children?.()}
</div>
