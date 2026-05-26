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

<p {...rest} class={cn(classProp, 'text-sm [font-weight:var(--font-weight-body,400)] text-foreground-muted')}>
	{@render children?.()}
</p>
