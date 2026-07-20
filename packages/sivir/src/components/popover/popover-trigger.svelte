<script lang="ts">
	import { Button } from '@sivir/ui/components/button';
	import { positionFloatingPanel } from '@sivir/ui/utils';
	import { onMount, tick } from 'svelte';
	import type { PopoverTriggerProps } from '.';
	import { getPopoverContext } from './context.svelte';

	const { id: key, state: popoverState } = getPopoverContext();

	let element = $state<HTMLButtonElement | undefined>();
	type Props = PopoverTriggerProps;

	let {
		children,
		class: classProp,
		onclick,
		style,
		id,
		'aria-haspopup': ariaHaspopup,
		'aria-controls': ariaControls,
		'aria-label': ariaLabel,
		...rest
	}: Props = $props();

	onMount(() => {
		popoverState.buttonRef = element ?? null;
	});

	function openPopover() {
		if (popoverState.closeTimeout) {
			clearTimeout(popoverState.closeTimeout);
			popoverState.closeTimeout = undefined;
		}
		popoverState.open = true;

		const button = element;
		const popover = popoverState.popoverRef;

		if (button && popover) {
			positionFloatingPanel(button, popover, popoverState.placement);
		}
	}

	function closePopover(delay = 180) {
		if (popoverState.closeTimeout) clearTimeout(popoverState.closeTimeout);

		if (delay <= 0) {
			popoverState.open = false;
			popoverState.closeTimeout = undefined;
			return;
		}

		popoverState.closeTimeout = setTimeout(() => {
			popoverState.open = false;
			popoverState.closeTimeout = undefined;
		}, delay);
	}

	async function handleEnter() {
		if (popoverState.hoverable) {
			await tick();
			const delay = popoverState.delay ?? 0;
			if (delay > 0) {
				popoverState.hoverTimeout = setTimeout(() => {
					if (element?.matches(':hover, :focus')) {
						openPopover();
					}
				}, delay);
			} else {
				openPopover();
			}

			popoverState.hovering = true;
		}
	}

	function handleLeave() {
		if (popoverState.hoverable) {
			if (popoverState.hoverTimeout) {
				clearTimeout(popoverState.hoverTimeout);
				popoverState.hoverTimeout = undefined;
			}
			closePopover(popoverState.closeDelay ?? 180);
			popoverState.hovering = false;
		}
	}
</script>

<Button
	bind:element
	{...rest}
	class={classProp}
	{style}
	onclick={() => {
		if (popoverState.open) closePopover(0);
		else openPopover();
		onclick?.();
	}}
	onmouseenter={handleEnter}
	onmouseleave={handleLeave}
	onfocus={handleEnter}
	onblur={handleLeave}
	aria-haspopup={ariaHaspopup ?? 'dialog'}
	aria-expanded={popoverState.open ? 'true' : 'false'}
	data-state={popoverState.open ? 'open' : 'closed'}
	aria-controls={ariaControls ?? `popover-${String(key)}-content`}
	aria-label={ariaLabel}
	id={id ?? `popover-${String(key)}-controls`}
>
	{@render children?.()}
</Button>
