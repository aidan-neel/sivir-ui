<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { cn } from '@sivir/ui/utils';
	import { getContext, onMount } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';

	import type { ComboboxItem, ComboboxState } from '.';

	const key = getContext('key') as string;
	const uiState = states[key].data as ComboboxState;

	type Props = {
		class?: string;
		value: string;
		label: string;
		callback?: () => void;
	} & ButtonProps;

	let { label, value, class: className, callback, ...rest }: Props = $props();
	let el = $state<HTMLButtonElement | HTMLAnchorElement | undefined>();
	let item: ComboboxItem = $derived({
		value: value,
		label: label,
		callback: callback,
		ref: el
	}) as ComboboxItem;

	function close() {
		uiState.selected = item;
		uiState.open = false;
		uiState.searchContent = '';
		uiState.buttonRef?.focus();
		callback?.();
	}

	onMount(() => {
		uiState.items.add(item);
		return () => uiState.items.delete(item);
	});
</script>

{#if uiState.searchContent === '' || Array.from(uiState.results).some((r) => r.value === item.value)}
	<Button
		bind:element={el}
		id={`combobox-${key}-option-${value}`}
		role="option"
		aria-selected={uiState.selected?.value === item.value}
		{...rest}
		onclick={close}
		class={cn(className, MENU_ITEM)}
		variant="ghost"
	>
		{label}
		{#if uiState.selected?.value === item.value}
			<div aria-hidden="true">
				<Check />
			</div>
		{/if}
	</Button>
{/if}
