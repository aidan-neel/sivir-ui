<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '@silk/ui/components/button';
	import { computePosition, flip } from '@floating-ui/dom';
	import { getContext, onMount } from 'svelte';
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import type { ComboboxState } from '.';
	import * as Popover from '@silk/ui/components/popover';
	import { cn } from '@silk/ui/utils';
	import CaretSort from '@lucide/svelte/icons/chevrons-up-down';

	const key = getContext('key') as string;
	const uiState = states[key].data as ComboboxState;

	const {
		children,
		class: classProp,
		icon = true,
		...rest
	}: Popover.PopoverTriggerProps = $props();
</script>

<Popover.Trigger
	{...rest}
	role="combobox"
	aria-haspopup="listbox"
	aria-controls={`combobox-${String(key)}-listbox`}
	aria-expanded={uiState.open}
	aria-label={
		uiState.selected?.label
			? `Selected ${uiState.selected.label}`
			: ((rest as { 'aria-label'?: string })['aria-label'] ?? 'Open combobox')
	}
	class={cn(classProp, `flex flex-row justify-between items-center px-[var(--field-padding-x)] [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)]`)}
>
	{#if uiState.selected?.label}
		{uiState.selected?.label}
	{:else}
		{@render children?.()}
	{/if}
	{#if icon}
		<CaretSort class="text-foreground-muted size-3" />
	{/if}
</Popover.Trigger>
