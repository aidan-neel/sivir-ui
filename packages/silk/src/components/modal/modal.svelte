<script lang="ts">
	import { useState } from '@silk/ui/internals/state.svelte.ts';
	import { setContext } from 'svelte';
	import type { ModalProps, ModalState } from '.';

	let { open = $bindable(false), children }: ModalProps = $props();

	const uiState = useState<ModalState>({
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
