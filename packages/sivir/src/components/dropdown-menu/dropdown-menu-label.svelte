<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
	};

	let { children, class: className, ...rest }: Props = $props();
</script>

<p
	{...rest}
	data-ui="menu-label"
	class={cn(
		className,
		'text-[length:var(--text-xs)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-[var(--menu-label-foreground)] select-none px-[var(--menu-label-padding-x)] py-[var(--menu-label-padding-y)]'
	)}
>
	{@render children?.()}
</p>
