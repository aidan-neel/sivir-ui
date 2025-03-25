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

<p {...rest} class={cn(classProp, ``)}>
	<span class="text-foreground-muted px-3 text-lg">•</span><span
		class="text-foreground font-semibold">{title}:</span
	>
	{@render children?.()}
</p>
