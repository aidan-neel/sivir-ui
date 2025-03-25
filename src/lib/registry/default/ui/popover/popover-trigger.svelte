<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { button, type ButtonProps } from '$lib/ui/components/button/variants';
	import { Button } from '$lib/ui/components/button';
	import { bindTriggerToButton } from '$lib/ui/internals/trigger';
	import { getPopoverUIState, STATE_KEY } from './lib.svelte';
	import { computePosition, flip } from '@floating-ui/dom';

	let element: HTMLButtonElement | undefined = $state();
	let bound = false;
	const { children, class: classProp, ...rest }: HTMLButtonAttributes & ButtonProps = $props();
	const uiState = getPopoverUIState();

	$effect(() => {
		if (element && !bound) {
			bindTriggerToButton(element, uiState, () => {
				if (uiState.data && uiState.data.open) {
					let button = uiState.data.buttonRef;
					let popover = uiState.data.popoverRef;

					computePosition(button, popover, {
						placement: uiState.data.placement,
						middleware: [flip()]
					}).then(({ x, y }) => {
						Object.assign(popover.style, {
							left: `${x}px`,
							top: `${y}px`
						});
					});
				}
			});
			bound = true;
		}

		if (uiState.data) {
			uiState.data.buttonRef = element;
		}
	});
</script>

<Button id={`${String(STATE_KEY)}-controls`} bind:element {...rest} class={classProp}>
	{#if children}
		{@render children?.()}
	{/if}
</Button>
