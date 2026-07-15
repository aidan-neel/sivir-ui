<script lang="ts">
	import { getContext } from 'svelte';
	import { type ContextMenuCheckboxItemProps, type ContextMenuState } from '.';
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { Button } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import Check from '@lucide/svelte/icons/check';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';

	const key = getContext<string>('key');
	const parent = getContext<string>('parent');
	const uiState = states[key].data as ContextMenuState;

	let {
		class: className,
		children,
		value,
		callback,
		inset = false,
		...rest
	}: ContextMenuCheckboxItemProps = $props();

	function getOrCreateCheckboxItem(itemValue: string) {
		const existingItem = Array.from(uiState.checkboxItems).find((item) => item.value === itemValue);
		if (existingItem) return existingItem;
		const nextItem = { value: itemValue, checked: false };
		uiState.checkboxItems.add(nextItem);
		return nextItem;
	}

	const checkboxItem = $derived(getOrCreateCheckboxItem(value));

	function toggle() {
		if (!checkboxItem) return;
		checkboxItem.checked = !checkboxItem.checked;
		setTimeout(() => {
			uiState.open = false;
		}, 1);
		if (parent) {
			(states[parent].data as ContextMenuState).open = false;
		}
		callback?.();
	}
</script>

<Button
	{...rest}
	onclick={toggle}
	class={cn(className, `${MENU_ITEM} relative ${inset ? 'pl-8' : ''}`)}
	variant="ghost"
>
	<div class="absolute left-2 h-4 w-4">
		{#if checkboxItem?.checked}
			<Check class="text-foreground" />
		{/if}
	</div>
	{@render children?.()}
</Button>
