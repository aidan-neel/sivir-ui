<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { PopoverTitleProps } from '.';

    const key = getContext("key") as string;

	let {
		children,
		class: classProp,
		...rest
	}: PopoverTitleProps = $props();
</script>

<p
	id={`$popover-{String(key)}-title`}
	{...rest}
	class={cn(classProp, `text-text text-lg text-foreground font-medium tracking-[-0.02em] [font-family:var(--font-header),sans-serif]`)}
>
	{@render children?.()}
</p>
