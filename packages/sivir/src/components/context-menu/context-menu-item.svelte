<script lang="ts">
	import { getContext } from 'svelte';
	import type { ContextMenuItemProps, ContextMenuState } from '.';
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { Button } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';

	const key = getContext<string>('key');
	const parent = getContext<string>('parent');
	const uiState = states[key].data as ContextMenuState;

	let {
		class: className,
		children,
		callback,
		inset = false,
		...rest
	}: ContextMenuItemProps = $props();
</script>

<Button
	role="menuitem"
	{...rest}
	onclick={() => {
		uiState.open = false;
		if (parent) {
			(states[parent].data as ContextMenuState).open = false;
		}
		callback?.();
	}}
	class={cn(className, `${MENU_ITEM} ${inset ? 'pl-8' : ''}`)}
	variant="ghost"
>
	{@render children?.()}
</Button>
