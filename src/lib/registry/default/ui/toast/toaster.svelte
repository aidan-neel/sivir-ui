<script lang="ts">
	import { onDestroy } from 'svelte';
	import { setToastUIState, type ToastUIState } from './lib.svelte';
	import type { UIState } from '$lib/ui/internals/state.svelte';
	import Toast from './toast.svelte';

	const state: UIState<ToastUIState> = setToastUIState();
</script>

{#if state.data}
	<div class="fixed bottom-12 right-12 flex flex-col gap-2">
		{#each state.data.toasts as toast, i (toast.id)}
			<Toast {toast} index={i} />
		{/each}
	</div>
{/if}
