<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import { cn } from '@silk/ui/utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className
	}: {
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<Popover.Content
	role="none"
	allowClickOutside={false}
	aria-label="Tooltip"
	class={cn(
		className,
		'bg-[var(--color-tooltip)] text-[var(--color-tooltip-foreground)] max-w-[18rem] rounded-md border border-border px-[var(--tooltip-padding-x)] py-[var(--tooltip-padding-y)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] shadow-[var(--tooltip-shadow,var(--shadow-sm))]'
	)}
>
	<div role="tooltip">
		{@render children?.()}
	</div>
</Popover.Content>
