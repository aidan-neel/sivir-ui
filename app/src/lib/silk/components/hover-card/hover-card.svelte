<script lang="ts">
	import { setContext } from 'svelte';
	import { useState } from '$lib/silk/internals/state.svelte.ts';
	import type { HoverCardProps, HoverCardState } from '.';

	let {
		open = $bindable(false),
		openDelay = 200,
		closeDelay = 150,
		children
	}: HoverCardProps = $props();

	const uiState = useState<HoverCardState>({
		open,
		triggerRef: null,
		contentRef: null,
		openTimer: undefined,
		closeTimer: undefined,
		openDelay,
		closeDelay
	});

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
		uiState.data.openDelay = openDelay;
		uiState.data.closeDelay = closeDelay;
	});

	setContext('key', uiState.key);
</script>

{@render children?.()}
