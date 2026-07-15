<script lang="ts">
	import type { ContextMenuItemProps } from '.';
	import { Button } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';
	import { getContextMenuContext } from './context.svelte';

	const { state: contextMenuState, parentState } = getContextMenuContext();

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
		contextMenuState.open = false;
		if (parentState) parentState.open = false;
		callback?.();
	}}
	class={cn(className, `${MENU_ITEM} ${inset ? 'pl-8' : ''}`)}
	variant="ghost"
>
	{@render children?.()}
</Button>
