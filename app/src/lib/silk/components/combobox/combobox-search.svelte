<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '$lib/silk/components/button';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import type { ComboboxItem, ComboboxSearchProps, ComboboxState } from '.';
    import Search from "@lucide/svelte/icons/search";
    import Fuse from 'fuse.js'

	const key = getContext("key") as string;
	const uiState = states[key].data as ComboboxState;

	let element = $state<HTMLInputElement | undefined>();

	const { children,  class: classProp, threshold = 0.5, placeholder = 'Search...', ...rest }: ComboboxSearchProps = $props();

    onMount(() => {
        if (element) {
            element.focus();
        }
    })

    function handleInput() {
        const itemsArray = Array.from(uiState.items); // ComboboxItem[]

        const namesArray = itemsArray.map(item => item.value);

        const fuse = new Fuse(namesArray, { threshold });
        const results = fuse.search(uiState.searchContent);

        const resultSet = new Set<ComboboxItem>(
            results.map(r => itemsArray.find(item => item.value === r.item)!)
        );

        uiState.results = resultSet;
    }
</script>

<div class="flex items-center border-b border-input gap-2 p-2 px-3 w-full">
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
		class="w-full text-sm font-medium placeholder:text-foreground-muted focus-visible:outline-none"
	/>
</div>
