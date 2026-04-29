<script lang="ts">
	import { Button, type ButtonProps } from '$lib/silk/components/button';
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import { cn } from '$lib/silk/utils';
	import { getContext, onDestroy, onMount, setContext, tick, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Check from '@lucide/svelte/icons/check';

	import type { ComboboxItem, ComboboxState } from '.';

	const key = getContext('key') as string;
	const parent = getContext('parent') as string;
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

	async function close() {
		uiState.selected = item;
		uiState.open = false;
		uiState.searchContent = '';
		uiState.buttonRef?.focus();
		callback?.();
	}

	onMount(() => {
		if (!uiState.items.has(item)) {
			uiState.items.add(item);
		}
	});
</script>

{#if uiState.searchContent === ''}
	<Button
		bind:element={el}
		id={`combobox-${key}-option-${value}`}
		role="option"
		aria-selected={uiState.selected?.value === item.value}
		{...rest}
	onclick={close}
	class={cn(
		className,
		'min-h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] rounded-[var(--radius-lg)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] duration-150 hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] w-full text-[14px] duration-50 font-medium hover:cursor-default px-2 items-center justify-between text-left'
	)}
	variant={'ghost'}
	>
		{label}
		{#if uiState.selected?.value === item.value}
			<div aria-hidden="true">
				<Check />
			</div>
		{/if}
	</Button>
{:else}
	<Button
		bind:element={el}
		id={`combobox-${key}-option-${value}`}
		role="option"
		aria-selected={uiState.selected?.value === item.value}
		{...rest}
	onclick={close}
	class={cn(
		className,
		'min-h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] rounded-[var(--radius-lg)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] duration-150 hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] w-full text-[14px] duration-50 font-medium hover:cursor-default px-2 items-center justify-between text-left',
		uiState.searchContent !== '' &&
			!Array.from(uiState.results).some((r) => r.value === item.value) &&
			'hidden'
	)}
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
