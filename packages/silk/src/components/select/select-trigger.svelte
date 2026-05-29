<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import { cn } from '@silk/ui/utils';
	import { getContext, type Snippet } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { states, type UIState } from '@silk/ui/internals/state.svelte.ts';
	import type { ButtonVariant } from '@silk/ui/components/button';
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
			? uiState.data.selectedLabel || uiState.data.labels.get(uiState.data.value) || ''
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
		`flex flex-row justify-between px-[var(--field-padding-x)] items-center [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] ${uiState.data.value !== '' ? 'text-foreground' : 'text-foreground-muted'}`
	)}
	role="combobox"
	aria-haspopup="listbox"
	aria-controls={`popover-${String(key)}-content`}
	aria-expanded={uiState.data.open}
	aria-label={
		uiState.data.value !== ''
			? `Selected value ${uiState.data.selectedLabel || uiState.data.value}`
			: ((rest as { 'aria-label'?: string })['aria-label'] ?? 'Open select')
	}
	{variant}
	{...rest}
>
	<div class="relative min-w-0 flex-1 pr-2 text-left">
		<span class="invisible block truncate leading-tight">{widestLabel}</span>
		<span class="absolute inset-0 flex items-center">
			<span class="block min-w-0 flex-1 truncate leading-tight">
				{#if selectedLabel}
					{selectedLabel}
				{:else}
					{@render children?.()}
				{/if}
			</span>
		</span>
	</div>
	<ChevronDown aria-hidden="true" />
</Popover.Trigger>
