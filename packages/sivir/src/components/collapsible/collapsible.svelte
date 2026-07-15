<script lang="ts">
	import { setContext, untrack } from 'svelte';
	import { useState } from '@sivir/ui/internals/state.svelte.ts';
	import type { CollapsibleProps, CollapsibleState } from '.';

	let { open = $bindable(false), children, disabled = false }: CollapsibleProps = $props();

	const uiState = useState<CollapsibleState>({
		open: untrack(() => open),
		disabled: untrack(() => disabled)
	});
	let synced = $state(untrack(() => open));

	$effect(() => {
		if (open !== synced) {
			synced = open;
			uiState.data.open = open;
		}
	});
	$effect(() => {
		if (uiState.data.open !== synced) {
			synced = uiState.data.open;
			open = uiState.data.open;
		}
	});
	$effect(() => {
		uiState.data.disabled = disabled;
	});

	setContext('key', uiState.key);
</script>

{@render children?.()}
