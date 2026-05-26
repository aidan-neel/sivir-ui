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
	class={cn(classProp, 'm-0 text-[0.8rem] leading-[1.55] [font-weight:var(--font-weight-body,400)] text-foreground-muted')}
>
	{@render children?.()}
</p>
