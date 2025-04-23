<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button } from '$lib/ui/components/button';
	import { bindTriggerToButton } from '$lib/ui/internals/trigger';
	import { getModalUIState, STATE_KEY } from './lib.svelte';

	let element: HTMLButtonElement | undefined = $state();
	let bound = false;
	const { children, class: classProp, ...rest }: HTMLButtonAttributes = $props();
	const uiState = getModalUIState();

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
