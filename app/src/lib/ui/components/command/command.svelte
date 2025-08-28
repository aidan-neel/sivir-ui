<script lang="ts">
	import { onDestroy, onMount, setContext, type Snippet } from 'svelte';
    import { getState, states } from '$lib/ui/internals/state.svelte';
	import type { CommandState } from '.';

	const {
		class: classProp,
		open = false,
        stateKey,
        children,
		...rest
	}: {
		class?: string;
		open?: boolean;
        stateKey?: string;
        children?: Snippet;
	} = $props();

    const key = stateKey ?? Math.random().toString(36).substring(2);
    setContext("key", key)

    const uiState = getState(key, {
        open: false,
        items: new Set(),
        results: new Set(),
        searchContent: "",
    } as CommandState)

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

{@render children?.()}