<script lang="ts">
	import { UIState } from '$lib/ui/internals/state.svelte';
	import { onDestroy, type Snippet } from 'svelte';
	import {
		getModalUIState,
		setModalUIState,
		type ModalUIState
	} from './lib.svelte';

	const state: UIState<ModalUIState> = setModalUIState();
	const { children, open = $bindable(state.data.open) }: { children: Snippet; open: boolean } =
		$props();
</script>

{@render children?.()}
