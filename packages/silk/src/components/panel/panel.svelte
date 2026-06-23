<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import type { PanelProps } from '.';

	let { children, class: className, ...rest }: PanelProps = $props();
</script>

<div
	data-ui="panel"
	class={cn(
		'silk-panel relative rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-[var(--panel-padding)]',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>

<style>
	/* The signature: a second hairline inset from the edge, its corner radius
	   reduced by the same inset so it stays concentric with the outer corner.
	   Purely decorative — it never intercepts pointer events. */
	.silk-panel::after {
		content: '';
		position: absolute;
		inset: var(--panel-inset, 4px);
		border: var(--border-size) solid var(--color-border);
		border-radius: calc(var(--radius-lg) - var(--panel-inset, 4px));
		pointer-events: none;
	}
</style>
