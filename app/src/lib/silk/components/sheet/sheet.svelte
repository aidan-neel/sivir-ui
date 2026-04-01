<script lang="ts">
	import { useState } from '$lib/silk/internals/state.svelte.ts';
	import { setContext } from 'svelte';
	import type { SheetState, SheetProps } from '.';

	let { open = $bindable(false), class: className, children }: SheetProps = $props();

	const uiState = useState<SheetState>({
		open
	});

	$effect(() => {
		if (uiState.data.open !== open) {
			uiState.data.open = open;
		}
	});

	$effect(() => {
		open = uiState.data.open;
	});

	setContext('key', uiState.key);
</script>

{@render children?.()}
