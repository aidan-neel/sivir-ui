<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { SeparatorProps } from '.';

	let {
		class: className,
		orientation = 'horizontal',
		decorative = true,
		...rest
	}: SeparatorProps = $props();
</script>

<div
	data-ui="separator"
	data-orientation={orientation}
	role={decorative ? 'none' : 'separator'}
	aria-orientation={decorative ? undefined : orientation}
	class={cn(
		className,
		'shrink-0 bg-[var(--separator-color)]',
		orientation === 'horizontal'
			? 'h-[var(--separator-thickness)] w-full'
			: 'h-full w-[var(--separator-thickness)]'
	)}
	{...rest}
></div>
