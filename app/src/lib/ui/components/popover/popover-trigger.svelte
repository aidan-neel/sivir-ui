<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '$lib/ui/components/button';
	import { computePosition, flip } from '@floating-ui/dom';
	import { getContext, onMount } from 'svelte';
	import { states } from '$lib/ui/internals/state.svelte';

	const key = getContext("key") as string;
	const uiState = states[key];

	let element: HTMLButtonElement | undefined = $state();
	const { children, class: classProp, ...rest }: ButtonProps = $props();

    onMount(() => {
        uiState.data.buttonRef = element;
    })

	function openPopover() {
		if (!uiState.data) return;
		if (uiState.data.closeTimeout) {
			clearTimeout(uiState.data.closeTimeout);
			uiState.data.closeTimeout = null;
		}

		uiState.data.open = true;

		const button = element;
		const popover = uiState.data.popoverRef;

		if (button && popover) {
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
	}

	function closePopover(delay = 150) {
		if (!uiState.data) return;

		if (uiState.data.closeTimeout) clearTimeout(uiState.data.closeTimeout);

		uiState.data.closeTimeout = setTimeout(() => {
			uiState.data.open = false;
			uiState.data.closeTimeout = null;
		}, delay);
	}

	function cancelClose() {
		if (uiState.data?.closeTimeout) {
			clearTimeout(uiState.data.closeTimeout);
			uiState.data.closeTimeout = null;
		}
	}
</script>

<Button
	bind:element
	{...rest}
	class={classProp}
	onclick={!uiState?.data.hoverable ? openPopover : undefined}
	onmouseenter={uiState?.data.hoverable ? (() => {
		const delay = uiState?.data?.delay ?? 0;
		if (delay > 0) {
			const hoverTimeout = setTimeout(() => {
				// still hovering over button before triggering
				if (uiState.data?.hoverable && element?.matches(':hover')) {
					openPopover();
				}
			}, delay);
			uiState.data.hoverTimeout = hoverTimeout;
		} else {
			openPopover();
		}
	}) : undefined}
	onmouseleave={uiState?.data.hoverable ? (() => {
		if (uiState.data?.hoverTimeout) {
			clearTimeout(uiState.data.hoverTimeout);
			uiState.data.hoverTimeout = null;
		}
		closePopover(uiState?.data?.closeDelay ?? 150);
	}) : undefined}
	aria-haspopup="dialog"
	aria-expanded="true"
	aria-controls={`${String(key)}-content`}
	id={`${String(key)}-controls`}
>
	{#if children}
		{@render children?.()}
	{/if}
</Button>
