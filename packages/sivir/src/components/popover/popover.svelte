<script lang="ts">
	import { onDestroy, onMount, setContext, untrack } from 'svelte';
	import { useState, states } from '@sivir/ui/internals/state.svelte.ts';
	import type { PopoverProps, PopoverState } from '.';

	let {
		open = $bindable(false),
		placement = 'bottom',
		children,
		state_key,
		state: providedState,
		hoverable,
		delay = 0,
		closeDelay = 150
	}: PopoverProps = $props();

	const generatedKey = Math.random().toString(36).substring(2);
	const initial = untrack(() => ({
		key: state_key ?? providedState?.key ?? generatedKey,
		state: providedState,
		placement,
		hoverable: hoverable ?? false,
		delay,
		closeDelay
	}));
	const localState = useState<PopoverState>(
		{
			open,
			trigger: null,
			focusedElement: null,
			buttonRef: null,
			popoverRef: undefined,
			placement: initial.placement,
			onclick: undefined,
			closeTimeout: undefined,
			hoverable: initial.hoverable,
			delay: initial.delay,
			closeDelay: initial.closeDelay
		} as PopoverState,
		initial.key
	);
	const key = initial.key;
	const uiState = initial.state ?? localState;
	let syncedOpen = $state(open);

	setContext('key', key);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			if (uiState.data) {
				uiState.data.open = false;
			}
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);

		if (uiState.data) {
			uiState.data.placement = placement;
			uiState.data.hoverable = hoverable ?? false;
			uiState.data.delay = delay;
			uiState.data.closeDelay = closeDelay;
		}

		return () => document.removeEventListener('keydown', handleKeydown);
	});

	$effect(() => {
		if (uiState.data) {
			uiState.data.placement = placement;
			uiState.data.hoverable = hoverable ?? false;
			uiState.data.delay = delay;
			uiState.data.closeDelay = closeDelay;
			if (open !== syncedOpen) {
				syncedOpen = open;
				uiState.data.open = open;
			}
		}
	});

	$effect(() => {
		if (uiState.data && uiState.data.open !== syncedOpen) {
			syncedOpen = uiState.data.open;
			open = uiState.data.open;
		}
	});

	onDestroy(() => {
		delete states[key];
	});
</script>

{@render children?.()}
