<script lang="ts">
	import { Button, type ButtonProps } from '$lib/silk/components/button';
	import { states, type UIState } from '$lib/silk/internals/state.svelte.ts';
	import { cn } from '$lib/silk/utils';
	import { getContext, onDestroy, tick, type Snippet } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import type { SelectState } from '.';

	const key = getContext('key') as string;
	const uiState = states[key] as UIState<SelectState>;

	type Props = {
		value: string;
	} & ButtonProps;

	let { children, class: className, value, ...rest }: Props = $props();
	let element = $state<HTMLButtonElement | HTMLAnchorElement | undefined>();

	$effect(() => {
		uiState.data.values.add(value);
		void tick().then(() => {
			const label = element?.textContent?.trim();
			if (!label) return;
			uiState.data.labels.set(value, label);
			if (uiState.data.value === value) {
				uiState.data.selectedLabel = label;
			}
		});
	});

	onDestroy(() => {
		uiState.data.values.delete(value);
		uiState.data.labels.delete(value);
	});
</script>

<Button
	bind:element
	id={`select-${key}-option-${value}`}
	role="option"
	aria-selected={uiState.data.value === value}
	onclick={() => {
		uiState.data.value = value;
		uiState.data.selectedLabel =
			element?.textContent?.trim() || uiState.data.labels.get(value) || value;
		uiState.data.open = false;
		uiState.data.buttonRef?.focus();
	}}
	{...rest}
	class={cn(
		className,
		'min-h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] rounded-[var(--radius-lg)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] [transition-duration:var(--motion-duration-menu)] hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] w-full text-[14px] font-medium hover:cursor-default px-2 items-center justify-between text-left'
	)}
	variant={'ghost'}
>
	{@render children?.()}

	{#if uiState.data.value === value}
		<div aria-hidden="true">
			<Check />
		</div>
	{/if}
</Button>
