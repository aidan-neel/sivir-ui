<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button } from '$lib/ui/components/button';
	import { bindTriggerToButton } from '$lib/ui/internals/trigger';
	import { getPopoverUIState, STATE_KEY } from './lib.svelte';
	import { computePosition, flip } from '@floating-ui/dom';

	let element = $state<HTMLButtonElement | undefined>();
	const { children, class: classProp, ...rest }: HTMLButtonAttributes = $props();
	const uiState = getPopoverUIState();

	$effect(() => {
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

		uiState.data.buttonRef = element;
	});
</script>

<Button aria-haspopup="dialog" aria-expanded="true" aria-controls={`${String(STATE_KEY)}-content`} id={`${String(STATE_KEY)}-controls`} bind:element {...rest} class={classProp}>
	{#if children}
		{@render children?.()}
	{/if}
</Button>
