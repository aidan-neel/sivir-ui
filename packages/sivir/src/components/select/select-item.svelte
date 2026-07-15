<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { states, type UIState } from '@sivir/ui/internals/state.svelte.ts';
	import { cn } from '@sivir/ui/utils';
	import { getContext, tick } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import type { SelectState } from '.';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';

	const key = getContext('key') as string;
	const uiState = states[key] as UIState<SelectState>;

	type Props = {
		value: string;
		label?: string;
	} & ButtonProps;

	let { children, class: className, value, label, onclick: userOnclick, ...rest }: Props = $props();
	let element = $state<HTMLButtonElement | HTMLAnchorElement | undefined>();

	function resolveLabel() {
		if (label) return label;
		const fromAttr = element
			?.querySelector<HTMLElement>('[data-select-label]')
			?.textContent?.trim();
		if (fromAttr) return fromAttr;
		return element?.textContent?.trim() ?? '';
	}

	$effect(() => {
		const itemValue = value;
		let active = true;
		uiState.data.values.add(itemValue);
		void tick().then(() => {
			if (!active) return;
			const resolved = resolveLabel();
			if (!resolved) return;
			uiState.data.labels.set(itemValue, resolved);
			if (uiState.data.value === itemValue) {
				uiState.data.selectedLabel = resolved;
			}
		});

		return () => {
			active = false;
			uiState.data.values.delete(itemValue);
			uiState.data.labels.delete(itemValue);
		};
	});
</script>

<Button
	bind:element
	id={`select-${key}-option-${value}`}
	role="option"
	aria-selected={uiState.data.value === value}
	{...rest}
	onclick={() => {
		uiState.data.value = value;
		uiState.data.selectedLabel = resolveLabel() || uiState.data.labels.get(value) || value;
		uiState.data.open = false;
		uiState.data.buttonRef?.focus();
		userOnclick?.();
	}}
	class={cn(className, MENU_ITEM)}
	variant="ghost"
>
	{@render children?.()}

	{#if uiState.data.value === value}
		<div aria-hidden="true">
			<Check />
		</div>
	{/if}
</Button>
