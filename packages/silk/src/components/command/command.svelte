<script lang="ts">
	import { onDestroy, onMount, setContext, type Snippet } from 'svelte';
	import { useState, states } from '@silk/ui/internals/state.svelte.ts';
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

	const generatedKey = Math.random().toString(36).substring(2);
	// svelte-ignore state_referenced_locally
	const key = $derived(stateKey ?? generatedKey);
	// svelte-ignore state_referenced_locally
	setContext('key', key);

	// svelte-ignore state_referenced_locally
	const uiState = useState<CommandState>(
		{
			open: false,
			items: new Set(),
			results: new Set(),
			searchContent: ''
		} as CommandState,
		key
	);

	$effect(() => {
		uiState.data.open = open;
	});

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
	});
</script>

{@render children?.()}
