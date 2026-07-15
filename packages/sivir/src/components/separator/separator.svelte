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
		'shrink-0 bg-border',
		orientation === 'horizontal' ? 'h-[var(--border-size)] w-full' : 'h-full w-[var(--border-size)]'
	)}
	{...rest}
></div>
