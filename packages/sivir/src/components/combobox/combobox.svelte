<script lang="ts">
	import { onDestroy, onMount, setContext, untrack } from 'svelte';
	import { useState, states } from '@sivir/ui/internals/state.svelte.ts';
	import type { ComboboxState } from '.';
	import * as Popover from '@sivir/ui/components/popover';

	interface Props extends Popover.PopoverProps {
		placeholder?: string;
	}

	const { children, state_key, placeholder = 'Select…', ...rest }: Props = $props();

	const generatedKey = Math.random().toString(36).substring(2);
	const key = untrack(() => state_key ?? generatedKey);
	setContext('key', key);
	setContext(
		'placeholder',
		untrack(() => placeholder)
	);

	const uiState = useState<ComboboxState>(
		{
			open: false,
			items: new Set(),
			results: new Set(),
			searchContent: ''
		} as ComboboxState,
		key
	);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			if (uiState.data) {
				uiState.data.open = false;
				uiState.data.searchContent = '';
			}
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		delete states[key];
	});
</script>

<Popover.Root {...rest} state={uiState}>
	{@render children?.()}
</Popover.Root>
