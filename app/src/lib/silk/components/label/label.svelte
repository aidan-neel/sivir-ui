<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import type { LabelProps } from '.';

	let { class: className, children, ...rest }: LabelProps = $props();
</script>

<label
	data-ui="label"
	class={cn(
		'text-[length:var(--text-sm)] [font-weight:var(--font-weight-label,500)] leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
		className
	)}
	{...rest}
>
	{@render children?.()}
</label>
