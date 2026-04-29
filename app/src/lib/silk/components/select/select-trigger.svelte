<script lang="ts">
	import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';
	import { getContext, type Snippet } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { states, type UIState } from '$lib/silk/internals/state.svelte.ts';
	import type { ButtonVariant } from '$lib/silk/components/button';
	import type { SelectState } from '.';

	const key = getContext('key') as string;
	const uiState = states[key] as UIState<SelectState>;

	type Props = {
		children: Snippet;
		class?: string;
		variant?: ButtonVariant;
	} & Omit<Popover.PopoverTriggerProps, 'children' | 'class' | 'variant'>;

	let { children, class: className, variant, ...rest }: Props = $props();
	const selectedLabel = $derived(
		uiState.data.value !== ''
			? uiState.data.selectedLabel ||
					uiState.data.labels.get(uiState.data.value) ||
					uiState.data.value
			: ''
	);
	const widestLabel = $derived(
		Array.from(uiState.data.labels.values()).reduce((widest, current) => {
			return current.length > widest.length ? current : widest;
		}, selectedLabel || 'Select')
	);
</script>

<Popover.Trigger
	class={cn(
		className,
		`flex flex-row justify-between px-3 items-center font-medium ${uiState.data.value !== '' ? 'text-foreground' : 'text-foreground-muted'}`
	)}
	role="combobox"
	aria-haspopup="listbox"
	aria-controls={`popover-${String(key)}-content`}
	aria-expanded={uiState.data.open}
	aria-label={uiState.data.value !== '' ? `Selected value ${uiState.data.value}` : undefined}
	{variant}
	{...rest}
>
	<div class="relative min-w-0 flex-1 pr-2 text-left">
		<span class="invisible block truncate">{widestLabel}</span>
		<span class="absolute inset-0 truncate">
			{#if uiState.data.value !== ''}
				{selectedLabel}
			{:else}
				{@render children?.()}
			{/if}
		</span>
	</div>
	<ChevronDown aria-hidden="true" />
</Popover.Trigger>
