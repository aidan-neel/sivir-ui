<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import { useState } from '@sivir/ui/internals/state.svelte.ts';
	import type { ContextMenuProps, ContextMenuState } from '.';

	const key = Math.random().toString(36).substring(2);
	useState<ContextMenuState>(
		{
			open: false,
			trigger: null,
			focusedElement: null,
			buttonRef: null,
			popoverRef: undefined,
			placement: 'bottom',
			onclick: undefined,
			checkboxItems: new Set()
		} as ContextMenuState,
		key
	);

	let { children }: ContextMenuProps = $props();
</script>

<Popover.Root state_key={key}>
	{@render children?.()}
</Popover.Root>
