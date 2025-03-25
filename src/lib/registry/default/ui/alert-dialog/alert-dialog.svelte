<script lang="ts">
	import { UIState } from '$lib/ui/internals/state.svelte';
	import { onDestroy, type Snippet } from 'svelte';
	import {
		getAlertDialogUIState,
		setAlertDialogUIState,
		type AlertDialogUIState
	} from './lib.svelte';

	const state: UIState<AlertDialogUIState> = setAlertDialogUIState();
	const { children }: { children: Snippet } = $props();
</script>

{@render children?.()}
