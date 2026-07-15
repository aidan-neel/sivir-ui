<script lang="ts">
	import { getContext, tick } from 'svelte';
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import type { ComboboxState, ComboboxItem } from '.';
	import * as Popover from '@sivir/ui/components/popover';
	import { cn } from '@sivir/ui/utils';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Fuse from 'fuse.js';

	const key = getContext('key') as string;
	const placeholder = getContext('placeholder') as string;
	const uiState = states[key].data as ComboboxState;

	interface Props extends Omit<Popover.PopoverTriggerProps, 'children'> {
		class?: string;
		threshold?: number;
	}

	const { class: className, threshold = 0.5, variant = 'outline', ...rest }: Props = $props();

	let inputElement: HTMLInputElement | undefined = $state();

	function handleInput() {
		const itemsArray = Array.from(uiState.items);
		const namesArray = itemsArray.map((item) => item.value);
		const fuse = new Fuse(namesArray, { threshold });
		const results = fuse.search(uiState.searchContent);
		const resultSet = new Set<ComboboxItem>(
			results.map((r) => itemsArray.find((item) => item.value === r.item)!)
		);
		uiState.results = resultSet;
	}

	function handleInputKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			const firstResult = [...uiState.results][0];
			if (firstResult) {
				uiState.selected = firstResult;
				uiState.open = false;
				uiState.searchContent = '';
				firstResult.callback?.();
			}
		}
	}

	$effect(() => {
		if (!uiState.open) return;
		void tick().then(() => {
			inputElement?.focus({ preventScroll: true });
			inputElement?.select();
		});
	});
</script>

<Popover.Trigger
	{...rest}
	{variant}
	role="combobox"
	aria-haspopup="listbox"
	aria-controls={`combobox-${String(key)}-listbox`}
	aria-expanded={uiState.open}
	aria-label={uiState.selected?.label ? `Selected ${uiState.selected.label}` : 'Open combobox'}
	class={cn(
		className,
		'flex flex-row items-center justify-between px-3 [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] transition-[background-color,border-color,color,box-shadow,transform] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none active:scale-[var(--motion-press-scale)] motion-reduce:active:scale-100 focus-within:shadow-[var(--focus-ring)]',
		uiState.selected?.label ? 'text-foreground' : 'text-foreground-muted'
	)}
>
	<div class="min-w-0 flex-1 text-left">
		{#if uiState.open}
			<input
				bind:this={inputElement}
				bind:value={uiState.searchContent}
				{placeholder}
				oninput={handleInput}
				onkeydown={handleInputKeydown}
				class="w-full h-full bg-transparent text-foreground [font-size:var(--font-size-button)] [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] placeholder:text-foreground-muted placeholder:[font-weight:var(--font-weight-button,500)] focus:outline-none"
				aria-label="Search options"
			/>
		{:else if uiState.selected?.label}
			<span class="block truncate text-foreground [font-weight:var(--font-weight-button,500)]">
				{uiState.selected.label}
			</span>
		{:else}
			<span
				class="block truncate text-foreground-muted [font-weight:var(--font-weight-button,500)]"
			>
				{placeholder}
			</span>
		{/if}
	</div>
	<ChevronDown size={18} class="ml-2 flex-shrink-0 text-foreground-muted" aria-hidden="true" />
</Popover.Trigger>
