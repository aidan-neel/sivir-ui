<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import {
		alertDialogUIState,
		getAlertDialogUIState,
		type AlertDialogUIState,
		STATE_KEY
	} from './lib.svelte';
	import type { UIState } from '$lib/ui/internals/state.svelte';
    import { cubicOut } from 'svelte/easing';
	import { clickOutside, cn } from '$lib/ui/utils';
	import { flyAndScale } from '$lib/ui/internals/transition';
	import { fade } from 'svelte/transition';

	const {
		children,
		class: classProp,
		allowClickOutside = false,
		...rest
	}: {
		children: Snippet;
		class?: string;
		allowClickOutside?: boolean;
	} = $props();

	const state: UIState<AlertDialogUIState> = getAlertDialogUIState();

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
	});
</script>

{#if state.data?.open}
    <div transition:fade={{ duration: 150, easing: cubicOut }} class="fixed inset-0 z-40 bg-foreground/70"></div>
    <div
        transition:flyAndScale={{ duration: 300 }}
        class={cn(
            classProp,
            `p-6 rounded-lg border fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 m-auto shadow-sm bg-background min-w-[20rem] max-w-[35rem] min-h-[5rem] max-h-[30rem]`
        )}
        use:clickOutside={() => {
            if (allowClickOutside) {
                state.data.open = false;
            }
        }}
        role="alertdialog"
        aria-labelledby={`${String(STATE_KEY)}-title`}
        aria-describedby={`${String(STATE_KEY)}-desc`}
        aria-controls={`${String(STATE_KEY)}-controls`}
        aria-modal="true"
    >
        {@render children?.()}
    </div>
{/if}