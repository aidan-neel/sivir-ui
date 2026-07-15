<script lang="ts">
	import { untrack } from 'svelte';
	import { type ContextMenuCheckboxItemProps } from '.';
	import { Button } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import Check from '@lucide/svelte/icons/check';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';
	import { getContextMenuContext } from './context.svelte';

	const { state: contextMenuState, parentState } = getContextMenuContext();

	let {
		class: className,
		children,
		value,
		checked = $bindable(false),
		callback,
		inset = false,
		...rest
	}: ContextMenuCheckboxItemProps = $props();

	let internalChecked = $state(untrack(() => contextMenuState.checkboxItems.get(value) ?? checked));
	let syncedChecked = $state(untrack(() => internalChecked));
	untrack(() => contextMenuState.checkboxItems.set(value, internalChecked));

	$effect(() => {
		if (checked !== syncedChecked) {
			syncedChecked = checked;
			internalChecked = checked;
		}
	});
	$effect(() => {
		contextMenuState.checkboxItems.set(value, internalChecked);
		if (internalChecked !== syncedChecked) {
			syncedChecked = internalChecked;
			checked = syncedChecked;
		}
	});

	function toggle() {
		internalChecked = !internalChecked;
		contextMenuState.open = false;
		if (parentState) parentState.open = false;
		callback?.();
	}
</script>

<Button
	{...rest}
	role="menuitemcheckbox"
	aria-checked={internalChecked}
	onclick={toggle}
	class={cn(className, `${MENU_ITEM} relative ${inset ? 'pl-8' : ''}`)}
	variant="ghost"
>
	<div class="absolute left-2 h-4 w-4">
		{#if internalChecked}
			<Check class="text-foreground" />
		{/if}
	</div>
	{@render children?.()}
</Button>
