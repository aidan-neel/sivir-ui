<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import { onMount, type Snippet } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';
	import { getSelectContext } from './context.svelte';
	import { getPopoverContext } from '../popover/context.svelte';

	const { id, state: selectState, labels, values } = getSelectContext();
	const { state: popoverState } = getPopoverContext();

	type Props = {
		value: string;
		label?: string;
		children?: Snippet;
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

	onMount(() => {
		const itemValue = value;
		values.add(itemValue);

		// Register the display label only. Do NOT touch selectedLabel here —
		// writing it on menu open made pre-filled triggers jump when labels resolved.
		const resolved = resolveLabel();
		if (resolved) labels.set(itemValue, resolved);
		else {
			const raf = requestAnimationFrame(() => {
				const again = resolveLabel();
				if (again) labels.set(itemValue, again);
			});
			return () => {
				cancelAnimationFrame(raf);
				values.delete(itemValue);
			};
		}

		return () => {
			values.delete(itemValue);
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
		const resolved = resolveLabel() || labels.get(value) || value;
		labels.set(value, resolved);
		selectState.value = value;
		selectState.selectedLabel = resolved;
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
