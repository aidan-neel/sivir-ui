<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '$lib/ui/components/button';
	import { computePosition, flip } from '@floating-ui/dom';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { states } from '$lib/ui/internals/state.svelte';
	import type { CommandItem, CommandState } from '.';
    import Search from "@lucide/svelte/icons/search";
    import Fuse from 'fuse.js'

	const key = getContext("key") as string;
	const uiState = states[key].data as CommandState;

	let element = $state<HTMLInputElement | undefined>();

    type Props = {
        children?: Snippet;
        class?: string;
        threshold?: number;
    }
        
	const { children,  class: classProp, threshold = 0.5, ...rest }: Props = $props();

    onMount(() => {
        if (element) {
            element.focus();
        }
    })

    function handleInput() {
        const itemsArray = Array.from(uiState.items); // CommandItem[]
        console.log('All items:', itemsArray);

        const namesArray = itemsArray.map(item => item.name);
        console.log('Names array:', namesArray);

        const fuse = new Fuse(namesArray, { threshold });
        const results = fuse.search(uiState.searchContent);
        console.log('Fuse search results:', results);

        const resultSet = new Set<CommandItem>(
            results.map(r => itemsArray.find(item => item.name === r.item)!)
        );
        console.log('Mapped CommandItem results set:', resultSet);

        uiState.results = resultSet;
        console.log('uiState.results updated:', uiState.results);
    }
</script>

<div class="flex items-center border-b p-3 gap-2 w-full">
    <Search size={18} class="text-foreground-muted mt-0.5" />
    <input bind:value={uiState.searchContent} oninput={handleInput} bind:this={element} class="w-full placeholder:text-foreground-muted focus-visible:outline-none font-medium text-sm" placeholder="Type a command or search..." />
</div>
