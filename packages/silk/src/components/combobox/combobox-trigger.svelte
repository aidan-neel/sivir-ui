<script lang="ts">
	import { getContext, tick } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import type { ComboboxItem, ComboboxState } from '.';
	import { cn, positionFloatingPanel } from '@silk/ui/utils';
	import Fuse from 'fuse.js';
	import CaretSort from '@lucide/svelte/icons/chevrons-up-down';
	import SearchIcon from '@lucide/svelte/icons/search';

	const key = getContext('key') as string;
	const uiState = states[key].data as ComboboxState;

	type Props = {
		class?: string;
		placeholder?: string;
		threshold?: number;
		icon?: boolean;
	} & Omit<HTMLInputAttributes, 'value' | 'oninput' | 'class' | 'placeholder'>;

	let {
		class: classProp,
		placeholder = 'Search...',
		threshold = 0.5,
		icon = true,
		...rest
	}: Props = $props();

	let element = $state<HTMLInputElement | undefined>();

	// Register the input as the popover's anchor so Content positions + sizes
	// (`--popover-trigger-width`) to it and click-outside excludes it.
	$effect(() => {
		uiState.buttonRef = element ?? null;
	});

	// The field shows the live query while open, and the chosen label at rest.
	const displayValue = $derived(
		uiState.open ? uiState.searchContent : (uiState.selected?.label ?? '')
	);

	async function open() {
		if (uiState.open) return;
		uiState.open = true;
		await tick();
		const popover = uiState.popoverRef;
		if (element && popover) positionFloatingPanel(element, popover, uiState.placement ?? 'bottom');
	}

	function filter() {
		const itemsArray = Array.from(uiState.items);
		const fuse = new Fuse(
			itemsArray.map((item) => item.value),
			{ threshold }
		);
		const results = fuse.search(uiState.searchContent);
		uiState.results = new Set<ComboboxItem>(
			results.map((r) => itemsArray.find((item) => item.value === r.item)!)
		);
	}

	function handleInput(event: Event) {
		uiState.searchContent = (event.currentTarget as HTMLInputElement).value;
		filter();
		void open();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (!uiState.open) {
				void open();
				return;
			}
			const first = uiState.searchContent === '' ? [...uiState.items][0] : [...uiState.results][0];
			if (first) {
				uiState.selected = first;
				uiState.open = false;
				uiState.searchContent = '';
				first.callback?.();
			}
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			void open();
			void tick().then(() => {
				const list = uiState.popoverRef?.querySelector(`#combobox-${String(key)}-listbox`);
				list?.querySelector<HTMLElement>('[role="option"]:not(.hidden)')?.focus();
			});
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class={cn(
		classProp,
		'relative flex h-[var(--size-control-md)] w-full select-none items-center gap-2 rounded-[var(--radius-lg)] border border-border bg-[var(--color-field)] px-[var(--field-padding-x)] text-foreground transition-[background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--color-field-hover)] focus-within:border-[var(--field-focus-border)] focus-within:shadow-[0_0_0_3px_var(--color-ring)]'
	)}
	onclick={() => {
		element?.focus();
		void open();
	}}
>
	<SearchIcon class="size-4 shrink-0 text-foreground-muted" aria-hidden="true" />
	<input
		bind:this={element}
		{...rest}
		role="combobox"
		aria-haspopup="listbox"
		aria-controls={`combobox-${String(key)}-listbox`}
		aria-expanded={uiState.open}
		aria-autocomplete="list"
		aria-label={(rest as { 'aria-label'?: string })['aria-label'] ??
			(uiState.selected?.label ? `Selected ${uiState.selected.label}` : 'Search')}
		value={displayValue}
		{placeholder}
		autocomplete="off"
		spellcheck="false"
		class="min-w-0 flex-1 bg-transparent text-[0.8rem] leading-none text-foreground outline-none [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] placeholder:text-foreground-muted"
		onfocus={() => element?.select()}
		oninput={handleInput}
		onkeydown={handleKeydown}
	/>
	{#if icon}
		<CaretSort class="size-4 shrink-0 text-foreground-muted" aria-hidden="true" />
	{/if}
</div>
