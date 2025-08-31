<script lang="ts">
	import { onDestroy, onMount, setContext, type Snippet } from 'svelte';
    import { useState, states } from '$lib/ui/internals/state.svelte';
	import type { ComboboxState } from '.';
    import * as Popover from '$lib/ui/components/popover';

	const {
        children,
        state_key,
		...rest
	}: Popover.PopoverProps = $props();

    const key = state_key ?? Math.random().toString(36).substring(2);
    setContext("key", key)

    const uiState = useState<ComboboxState>({
        open: false,
        items: new Set(),
        results: new Set(),
        searchContent: "",
    } as ComboboxState, key)

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			if (uiState.data) {
                uiState.data.open = false;
            }
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);

		onDestroy(() => {
			document.removeEventListener('keydown', handleKeydown);
		});
	});

    onDestroy(() => {
        delete states[key];
    })
</script>

<Popover.Root {...rest} state={uiState}>
    {@render children?.()}
</Popover.Root>