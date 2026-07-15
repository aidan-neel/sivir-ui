<script lang="ts">
	import { useState } from '@sivir/ui/internals/state.svelte.ts';
	import { setContext } from 'svelte';
	import type { SheetState, SheetProps } from '.';

	let { open = $bindable(false), children }: SheetProps = $props();

	const uiState = useState<SheetState>({
		open,
		triggerRef: null
	});
	let syncedOpen = $state(open);

	$effect(() => {
		if (open !== syncedOpen) {
			syncedOpen = open;
			uiState.data.open = open;
		}
	});

	$effect(() => {
		if (uiState.data.open !== syncedOpen) {
			syncedOpen = uiState.data.open;
			open = uiState.data.open;
		}
	});

	setContext('key', uiState.key);
</script>

{@render children?.()}
