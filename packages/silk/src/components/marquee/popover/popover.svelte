<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';
	import { useState, states, UIState } from '@silk/ui/internals/state.svelte.ts';
	import type { PopoverProps, PopoverState } from '.';

	let {
		class: classProp,
		open = $bindable(false),
		stateName = 'popover',
		placement = 'bottom',
		children,
		state_key,
		state: providedState,
		hoverable,
		delay = 0,
		closeDelay = 150,
		...rest
	}: PopoverProps = $props();

	const generatedKey = Math.random().toString(36).substring(2);
	// svelte-ignore state_referenced_locally
	const localState = useState<PopoverState>(
		{
			open,
			trigger: null,
			focusedElement: null,
			buttonRef: null,
			popoverRef: undefined,
			placement,
			onclick: undefined,
			closeTimeout: undefined,
			hoverable: hoverable ?? false,
			delay,
			closeDelay
		} as PopoverState,
		state_key ?? providedState?.key ?? generatedKey
	);
	// svelte-ignore state_referenced_locally
	const key = $derived(state_key ?? providedState?.key ?? generatedKey);
	const uiState = $derived(providedState ?? localState);
	let syncedOpen = $state(open);

	// svelte-ignore state_referenced_locally
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

		onDestroy(() => {
			document.removeEventListener('keydown', handleKeydown);
		});

		if (uiState.data) {
			uiState.data.placement = placement;
			uiState.data.hoverable = hoverable ?? false;
			uiState.data.delay = delay;
			uiState.data.closeDelay = closeDelay;
		}
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
