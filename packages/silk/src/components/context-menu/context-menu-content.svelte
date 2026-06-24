<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import { getContext, type Snippet } from 'svelte';
	import type { ContextMenuContentProps, ContextMenuState } from '.';
	import { states } from '@silk/ui/internals/state.svelte.ts';

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
	class={className}
	surfaceClass="flex flex-col gap-0 p-[var(--menu-padding)]"
>
	{@render children?.()}
</Popover.Content>
