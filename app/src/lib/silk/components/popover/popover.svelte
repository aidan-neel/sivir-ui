<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';
	import { useState, states, UIState } from '$lib/silk/internals/state.svelte.ts';
	import type { PopoverProps, PopoverState } from '.';

	const {
		class: classProp,
		open = false,
		stateName = 'popover',
		placement = 'bottom',
		children,
		state_key,
		state,
		hoverable,
		delay = 0,
		closeDelay = 150,
		...rest
	}: PopoverProps = $props();

	const generatedKey = Math.random().toString(36).substring(2);
	// svelte-ignore state_referenced_locally
	const localState = useState<PopoverState>(
		{
			open: false,
			trigger: null,
			focusedElement: null,
			buttonRef: null,
			popoverRef: undefined,
			placement: 'bottom',
			onclick: undefined,
			closeTimeout: undefined,
			hoverable: false,
			delay: 0,
			closeDelay: 150
		} as PopoverState,
		state_key ?? state?.key ?? generatedKey
	);
	// svelte-ignore state_referenced_locally
	const key = $derived(state_key ?? state?.key ?? generatedKey);
	const uiState = $derived(state ?? localState);

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
			uiState.data.open = open;
		}
	});

	$effect(() => {
		if (uiState.data) {
			uiState.data.placement = placement;
			uiState.data.hoverable = hoverable ?? false;
			uiState.data.delay = delay;
			uiState.data.closeDelay = closeDelay;
			uiState.data.open = open;
		}
	});

	onDestroy(() => {
		delete states[key];
	});
</script>

{@render children?.()}
