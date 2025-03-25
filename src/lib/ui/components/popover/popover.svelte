<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import {
		STATE_KEY,
		getPopoverUIState,
		setPopoverUIState,
		type PopoverUIState
	} from './lib.svelte';
	import { clickOutside, cn } from '$lib/ui/utils';
	import BackgroundBlur from '../internals/background-blur.svelte';
	import type { UIState } from '$lib/ui/internals/state.svelte';

	const {
		class: classProp,
		open = false,
		stateName = 'popover',
		placement = 'bottom',
		children,
		...rest
	}: {
		class?: string;
		open?: boolean;
		stateName?: string;
		placement?: 'top' | 'left' | 'bottom' | 'right';
		children: any;
	} = $props();

	// State handling with the new system
	const state: UIState<PopoverUIState> = setPopoverUIState();

	// Handle keyboard events to close on Escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			state.data.open = false;
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);

		onDestroy(() => {
			document.removeEventListener('keydown', handleKeydown);
		});

		state.data.placement = placement;
	});
</script>

{@render children?.()}
