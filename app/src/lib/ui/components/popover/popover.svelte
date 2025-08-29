<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';
    import { useState, states } from '$lib/ui/internals/state.svelte';

	const {
		class: classProp,
		open = false,
		stateName = 'popover',
		placement = 'bottom',
		children,
        state_key,
        hoverable,
        delay = 0,
        closeDelay = 150,
		...rest
	}: {
		class?: string;
		open?: boolean;
		stateName?: string;
		placement?: 'top' | 'left' | 'bottom' | 'right';
		children: any;
        state_key?: string;
        hoverable?: boolean;
        delay?: number;
        closeDelay?: number;
	} = $props();

    const key = state_key ?? Math.random().toString(36).substring(2);
    setContext("key", key)

    const uiState = useState({
        open: false,
		trigger: null,
		focusedElement: null,
		buttonRef: null,
		popoverRef: undefined,
		placement: placement,
		onclick: undefined,
        closeTimeout: undefined,
        hoverable: hoverable ?? false,
        delay: delay,
        closeDelay: closeDelay,
    }, key)

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
        }
	});

    onDestroy(() => {
        delete states[key];
    })
</script>

{@render children?.()}