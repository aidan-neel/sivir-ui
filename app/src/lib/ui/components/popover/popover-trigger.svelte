<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '$lib/ui/components/button';
	import { computePosition, flip } from '@floating-ui/dom';
	import { getContext, onMount, tick } from 'svelte';
	import { states } from '$lib/ui/internals/state.svelte';
    
	const key = getContext("key") as string;
	const uiState = states[key];

	let element = $state<HTMLButtonElement | undefined>();
	const { children, class: classProp, ...rest }: ButtonProps = $props();

	onMount(() => {
		uiState.data.buttonRef = element;
	});

	function openPopover() {
		if (!uiState.data) return;

		if (uiState.data.closeTimeout) {
			clearTimeout(uiState.data.closeTimeout);
			uiState.data.closeTimeout = null;
		}
		uiState.data.open = true;

		const button = element;
		const popover = uiState.data.popoverRef;

        
        if (popover) {
            console.log('popoverref is undefined')
        }

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

	async function handleEnter() {
		if (uiState?.data?.hoverable) {
            await tick();
			const delay = uiState?.data?.delay ?? 0;
			if (delay > 0) {
				uiState.data.hoverTimeout = setTimeout(() => {
					if (element?.matches(':hover, :focus')) {
						openPopover();
					}
				}, delay);
			} else {
				openPopover();
			}

            uiState.data.hovering = true;
		}
	}

	function handleLeave() {
		if (uiState?.data?.hoverable) {
			if (uiState.data.hoverTimeout) {
				clearTimeout(uiState.data.hoverTimeout);
				uiState.data.hoverTimeout = null;
			}
			closePopover(uiState?.data?.closeDelay ?? 150);
            uiState.data.hovering = false;
		}
	}
</script>

<Button
	bind:element
	{...rest}
	class={classProp}
    onclick={() => {
        if (uiState.data.open) closePopover();
        else openPopover();
    }}	
    onmouseenter={handleEnter}
	onmouseleave={handleLeave}
	onfocus={handleEnter}
	onblur={handleLeave}
	aria-haspopup="dialog"
	aria-expanded={uiState.data?.open ? 'true' : 'false'}
	aria-controls={`${String(key)}-content`}
	id={`${String(key)}-controls`}
>
	{@render children?.()}
</Button>
