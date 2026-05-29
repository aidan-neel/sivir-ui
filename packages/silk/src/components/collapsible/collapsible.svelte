<script lang="ts">
	import { setContext } from 'svelte';
	import { useState } from '@silk/ui/internals/state.svelte.ts';
	import type { CollapsibleProps, CollapsibleState } from '.';

	let { open = $bindable(false), children, disabled = false }: CollapsibleProps = $props();

	const uiState = useState<CollapsibleState>({ open, disabled });
	let synced = $state(open);

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
