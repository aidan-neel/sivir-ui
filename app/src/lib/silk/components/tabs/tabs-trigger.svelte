<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import { getContext } from 'svelte';
	import type { TabsState, TabsTriggerProps } from '.';

	let { children, class: className, value, disabled = false, ...rest }: TabsTriggerProps = $props();

	const tabsState = getContext<TabsState>('tabs');

	function toIdPart(input: string) {
		return input
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	const triggerId = $derived(`${tabsState.id}-trigger-${toIdPart(value)}`);
	const contentId = $derived(`${tabsState.id}-content-${toIdPart(value)}`);
	const active = $derived(tabsState.value === value);
</script>

<button
	type="button"
	role="tab"
	id={triggerId}
	aria-selected={active}
	aria-controls={contentId}
	tabindex={active ? 0 : -1}
	data-ui="tabs-trigger"
	data-state={active ? 'active' : 'inactive'}
	{disabled}
	class={cn(
		className,
		'rounded-[var(--radius-lg)] hover:cursor-pointer border border-transparent px-2.5 py-1 text-sm font-medium transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50',
		active
			? 'border-border bg-secondary text-foreground shadow-[var(--outline-shadow)]'
			: 'text-foreground-muted hover:text-foreground'
	)}
	onclick={() => {
		if (!disabled) tabsState.value = value;
	}}
	{...rest}
>
	{@render children?.()}
</button>
