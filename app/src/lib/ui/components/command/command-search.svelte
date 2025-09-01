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

        const namesArray = itemsArray.map(item => item.name);

        const fuse = new Fuse(namesArray, { threshold });
        const results = fuse.search(uiState.searchContent);

        const resultSet = new Set<CommandItem>(
            results.map(r => itemsArray.find(item => item.name === r.item)!)
        );

        uiState.results = resultSet;
    }
</script>

<div class="flex items-center border-b border-input p-3 gap-2 w-full">
    <Search size={18} class="text-foreground-muted mt-0.5" />
    <input onkeydown={(e) => {
        if (e.key === "Enter") {
            console.log('enter')
            let firstResult = [...uiState.results][0];
            if (firstResult) {
                uiState.open = false;
                uiState.searchContent = '';
                firstResult.callback?.();
            }
        }
    }} bind:value={uiState.searchContent} oninput={handleInput} bind:this={element} class="w-full placeholder:text-foreground-muted focus-visible:outline-none font-medium text-sm" placeholder="Type a command or search..." />
</div>
