<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import { getContext } from 'svelte';
	import type { ContextMenuContentProps, ContextMenuState } from '.';
	import { states } from '@sivir/ui/internals/state.svelte.ts';

	const key = getContext<string>('key');
	const uiState = states[key].data as ContextMenuState;

	let { class: className, children, ...rest }: ContextMenuContentProps = $props();
</script>

<Popover.Content
	role="menu"
	tabindex={-1}
	data-ui="context-menu-content"
	refElement={uiState.virtualElement}
	focusTrap={false}
	lockScroll={false}
	{...rest}
	class={className}
	surfaceClass="flex flex-col gap-0 p-1"
>
	{@render children?.()}
</Popover.Content>
