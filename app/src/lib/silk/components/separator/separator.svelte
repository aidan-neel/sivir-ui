<script lang="ts">
	import { cn } from '$lib/silk/utils';
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
		'shrink-0 bg-border',
		orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
		className
	)}
	{...rest}
></div>
