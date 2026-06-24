<script lang="ts">
	import { Button, type ButtonProps } from '@silk/ui/components/button';
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { cn } from '@silk/ui/utils';
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

{#if uiState.searchContent === '' || Array.from(uiState.results).some((r) => r.value === item.value)}
	<Button
		bind:element={el}
		id={`combobox-${key}-option-${value}`}
		role="option"
		aria-selected={uiState.selected?.value === item.value}
		{...rest}
		onclick={close}
		class={cn(
			className,
			'[--button-height:var(--menu-item-height)] h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] py-0 rounded-[var(--radius-lg)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] [transition-duration:var(--motion-duration-menu)] ease-[var(--ease-out)] hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] w-full text-[length:var(--font-size-button)] [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] hover:cursor-default items-center justify-between text-left'
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
{/if}
