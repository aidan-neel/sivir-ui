<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import { tick } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';
	import { getSelectContext } from './context.svelte';
	import { getPopoverContext } from '@sivir/ui/components/popover/context.svelte';

	const { id, state: selectState } = getSelectContext();
	const { state: popoverState } = getPopoverContext();

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
		selectState.values.add(itemValue);
		void tick().then(() => {
			if (!active) return;
			const resolved = resolveLabel();
			if (!resolved) return;
			selectState.labels.set(itemValue, resolved);
			if (selectState.value === itemValue) {
				selectState.selectedLabel = resolved;
			}
		});

		return () => {
			active = false;
			selectState.values.delete(itemValue);
			selectState.labels.delete(itemValue);
		};
	});
</script>

<Button
	bind:element
	id={`select-${id}-option-${value}`}
	role="option"
	aria-selected={selectState.value === value}
	{...rest}
	onclick={() => {
		selectState.value = value;
		selectState.selectedLabel = resolveLabel() || selectState.labels.get(value) || value;
		selectState.open = false;
		popoverState.buttonRef?.focus();
		userOnclick?.();
	}}
	class={cn(className, MENU_ITEM)}
	variant="ghost"
>
	{@render children?.()}

	{#if selectState.value === value}
		<div aria-hidden="true">
			<Check />
		</div>
	{/if}
</Button>
