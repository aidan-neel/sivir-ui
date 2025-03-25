<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import { type Snippet } from 'svelte';
	import { Button } from '$lib/ui/components/button';
	import type { AlertDialogUIState } from './lib.svelte';
	import { getAlertDialogUIState } from './lib.svelte';
	import type { UIState } from '$lib/ui/internals/state.svelte';

	let {
		children,
		class: classProp,
		...rest
	}: {
		children: Snippet;
		class?: string;
	} = $props();

	const uiState: UIState<AlertDialogUIState> = getAlertDialogUIState();

	let element = $state<HTMLButtonElement>();

	$effect(() => {
		if (uiState.data.open) {
			uiState.data.focusedElement = element;
			element?.focus();
		}
	});
</script>

<Button
	bind:element
	tabindex={0}
	onclick={() => {
		if (uiState.data) {
			uiState.data.open = false;
		}
	}}
	{...rest}
	role="button"
	variant="outlined"
	class={cn(classProp, ``)}
>
	{@render children?.()}
</Button>
