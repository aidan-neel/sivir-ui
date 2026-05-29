<script lang="ts">
	import { getContext } from 'svelte';
	import { type ContextMenuCheckboxItemProps, type ContextMenuState } from '.';
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { Button } from '@silk/ui/components/button';
	import { cn } from '@silk/ui/utils';
	import Check from '@lucide/svelte/icons/check';

	const key = getContext<string>('key');
	const parent = getContext<string>('parent');
	const uiState = states[key].data as ContextMenuState;

	let { class: className, children, value, callback, inset = false, ...rest }: ContextMenuCheckboxItemProps = $props();

	function getOrCreateCheckboxItem(itemValue: string) {
		const existingItem = Array.from(uiState.checkboxItems).find((item) => item.value === itemValue);
		if (existingItem) return existingItem;
		const nextItem = { value: itemValue, checked: false };
		uiState.checkboxItems.add(nextItem);
		return nextItem;
	}

	const checkboxItem = $derived(getOrCreateCheckboxItem(value));

	async function toggle() {
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
	class={cn(
		className,
		`[--button-height:var(--menu-item-height)] h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] py-0 rounded-[var(--radius-lg)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] duration-150 hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] ${inset ? 'pl-8' : ''} relative w-full text-[14px] duration-50 hover:cursor-default items-center justify-between text-left`
	)}
	variant="ghost"
>
	<div class="absolute left-2 h-4 w-4">
		{#if checkboxItem?.checked}
			<Check class="text-foreground" />
		{/if}
	</div>
	{@render children?.()}
</Button>
