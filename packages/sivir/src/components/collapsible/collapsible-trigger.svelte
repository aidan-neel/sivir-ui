<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { CollapsibleTriggerProps } from '.';
	import { getCollapsibleContext } from './context.svelte';

	let { class: className, children, ...rest }: CollapsibleTriggerProps = $props();
	const { id, state } = getCollapsibleContext();
</script>

<button
	type="button"
	data-ui="collapsible-trigger"
	data-state={state.open ? 'open' : 'closed'}
	aria-expanded={state.open}
	aria-controls={`collapsible-${id}`}
	disabled={state.disabled}
	onclick={() => (state.open = !state.open)}
	class={cn(
		className,
		'inline-flex items-center gap-2 transition-[transform] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] active:scale-[var(--motion-press-scale)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]'
	)}
	{...rest}
>
	{@render children?.()}
</button>
