<script lang="ts">
	import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { ContextMenuContentProps, ContextMenuState } from '.';
	import { states } from '$lib/silk/internals/state.svelte.ts';

	const key = getContext<string>('key');
	const uiState = states[key].data as ContextMenuState;

	let { class: className, children, ...rest }: ContextMenuContentProps = $props();
</script>

<Popover.Content
	role="menu"
	tabindex={-1}
	data-ui="context-menu-content"
	refElement={uiState.virtualElement}
	{...rest}
	class={cn(
		className,
		'bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[var(--panel-shadow)] p-[var(--menu-padding)] flex flex-col gap-0'
	)}
>
	{@render children?.()}
</Popover.Content>
