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
		'relative z-10 rounded-[var(--radius-lg)] hover:cursor-pointer px-[var(--tabs-trigger-padding-x)] py-[var(--tabs-trigger-padding-y)] text-sm [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] leading-tight transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50',
		active ? 'text-foreground' : 'text-foreground-muted hover:text-foreground'
	)}
	onclick={() => {
		if (!disabled) tabsState.value = value;
	}}
	{...rest}
>
	{@render children?.()}
</button>
