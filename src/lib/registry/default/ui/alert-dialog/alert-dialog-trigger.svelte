<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { button, type ButtonProps } from '$lib/ui/components/button/variants';
	import { Button } from '$lib/ui/components/button';
	import { bindTriggerToButton } from '$lib/ui/internals/trigger';
	import { getAlertDialogUIState, STATE_KEY } from './lib.svelte';

	let element: HTMLButtonElement | undefined = $state();
	let bound = false;
	const { children, class: classProp, ...rest }: HTMLButtonAttributes & ButtonProps = $props();
	const uiState = getAlertDialogUIState();

	$effect(() => {
		if (element && !bound) {
			bindTriggerToButton(element, uiState, () => {});
			bound = true;
		}
	});
</script>

<Button id={`${String(STATE_KEY)}-controls`} bind:element {...rest} class={classProp}>
	{#if children}
		{@render children?.()}
	{/if}
</Button>
