<script lang="ts">
	import { onDestroy, setContext, untrack, type Snippet } from 'svelte';
	import { useState, states } from '@sivir/ui/internals/state.svelte.ts';
	import type { CommandState } from '.';

	const {
		open = false,
		stateKey,
		children
	}: {
		open?: boolean;
		stateKey?: string;
		children?: Snippet;
	} = $props();

	const generatedKey = Math.random().toString(36).substring(2);
	const key = untrack(() => stateKey ?? generatedKey);
	setContext('key', key);

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

	onDestroy(() => {
		delete states[key];
	});
</script>

{@render children?.()}
