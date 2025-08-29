<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import { type Snippet } from 'svelte';

	let {
		children,
		class: classProp,
		title,
		...rest
	}: {
		children: Snippet;
		class?: string;
		title: string;
	} = $props();
</script>

<p {...rest} class={cn(classProp, `text-foreground-muted`)}>
	<span class="text-foreground px-3">•</span><span
		class="text-foreground font-medium">{title} -</span
	>
	{@render children?.()}
</p>
