<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import type { ContextMenuState, ContextMenuSubProps } from '.';
	import { getContextMenuContext, setContextMenuContext } from './context.svelte';

	const { state: parentState } = getContextMenuContext();
	const id = $props.id();
	const contextMenuState = $state<ContextMenuState>({
		open: false,
		checkboxItems: new Map()
	});
	setContextMenuContext({ state: contextMenuState, parentState });

	let { children }: ContextMenuSubProps = $props();
</script>

<Popover.Root state_key={id} bind:open={contextMenuState.open} hoverable={true} placement="right">
	{@render children?.()}
</Popover.Root>
