<script lang="ts">
	import { getContext, tick } from 'svelte';
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import type { ComboboxItem, ComboboxSearchProps, ComboboxState } from '.';
	import Search from '@lucide/svelte/icons/search';
	import Fuse from 'fuse.js';

	const key = getContext('key') as string;
	const uiState = states[key].data as ComboboxState;

	let element = $state<HTMLInputElement | undefined>();

	const { threshold = 0.5, placeholder = 'Search...' }: ComboboxSearchProps = $props();

	$effect(() => {
		if (!uiState.open) return;

		void tick().then(() => {
			element?.focus();
			element?.select();
		});
	});

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
</script>

<div class="flex items-center border-b border-border gap-2 p-[var(--menu-search-padding)] w-full">
	<Search size={14} class="text-foreground-muted" />
	<input
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				let firstResult = [...uiState.results][0];
				if (firstResult) {
					uiState.selected = firstResult;
					setTimeout(() => {
						uiState.open = false;
						uiState.searchContent = '';
					}, 1);
					firstResult.callback?.();
				}
			}
		}}
		bind:value={uiState.searchContent}
		{placeholder}
		oninput={handleInput}
		bind:this={element}
		class="w-full [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] placeholder:text-foreground-muted focus-visible:outline-none"
	/>
</div>
