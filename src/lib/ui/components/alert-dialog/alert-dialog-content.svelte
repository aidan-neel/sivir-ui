<script lang="ts">
	import BackgroundBlur from '../internals/background-blur.svelte';
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import {
		alertDialogUIState,
		getAlertDialogUIState,
		type AlertDialogUIState,
		STATE_KEY
	} from './lib.svelte';
	import type { UIState } from '$lib/ui/internals/state.svelte';
	import { clickOutside, cn } from '$lib/ui/utils';
	import { flyAndScale } from '$lib/ui/internals/transition';

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

<BackgroundBlur open={state.data?.open}>
	<dialog
		transition:flyAndScale={{ duration: 200 }}
		class={cn(
			classProp,
			`p-6 rounded-lg border m-auto shadow-sm bg-background min-w-[20rem] max-w-[35rem] min-h-[5rem] max-h-[30rem]`
		)}
		use:clickOutside={() => {
			if (allowClickOutside) {
				state.data.open = false;
			}
		}}
		open={state.data?.open}
		role="alertdialog"
		aria-labelledby={`${String(STATE_KEY)}-title`}
		aria-describedby={`${String(STATE_KEY)}-desc`}
		aria-controls={`${String(STATE_KEY)}-controls`}
		aria-modal="true"
	>
		{@render children?.()}
	</dialog>
</BackgroundBlur>
