<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import { getContext } from 'svelte';
	import type { TabsContentProps, TabsState } from '.';

	let {
		children,
		class: className,
		value,
		forceMount = false,
		...rest
	}: TabsContentProps = $props();

	const tabsState = getContext<TabsState>('tabs');

	function toIdPart(input: string) {
		return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
	}

	const triggerId = $derived(`${tabsState.id}-trigger-${toIdPart(value)}`);
	const contentId = $derived(`${tabsState.id}-content-${toIdPart(value)}`);
	const active = $derived(tabsState.value === value);
</script>

{#if forceMount || active}
	<div
		role="tabpanel"
		id={contentId}
		aria-labelledby={triggerId}
		data-ui="tabs-content"
		data-state={active ? 'active' : 'inactive'}
		hidden={!active}
		tabindex="0"
		class={cn(className, 'focus-visible:outline-none')}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
