<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { positionFloatingPanel } from '@silk/ui/utils';
	import { getContext, onMount, tick } from 'svelte';
	import { states, type UIState } from '@silk/ui/internals/state.svelte.ts';
	import type { PopoverState, PopoverTriggerProps } from '.';

	const key = getContext('key') as string;
	const uiState = states[key] as UIState<PopoverState>;

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
		uiState.data.buttonRef = element ?? null;
	});

	function openPopover() {
		if (!uiState.data) return;

		if (uiState.data.closeTimeout) {
			clearTimeout(uiState.data.closeTimeout);
			uiState.data.closeTimeout = undefined;
		}
		uiState.data.open = true;

		const button = element;
		const popover = uiState.data.popoverRef;

		if (button && popover) {
			positionFloatingPanel(button, popover, uiState.data.placement);
		}
	}

	function closePopover(delay = 180) {
		if (!uiState.data) return;
		if (uiState.data.closeTimeout) clearTimeout(uiState.data.closeTimeout);

		if (delay <= 0) {
			uiState.data.open = false;
			uiState.data.closeTimeout = undefined;
			return;
		}

		uiState.data.closeTimeout = setTimeout(() => {
			uiState.data.open = false;
			uiState.data.closeTimeout = undefined;
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
				uiState.data.hoverTimeout = undefined;
			}
			closePopover(uiState?.data?.closeDelay ?? 180);
			uiState.data.hovering = false;
		}
	}
</script>

<Button
	bind:element
	{...rest}
	class={classProp}
	{style}
	onclick={() => {
		if (uiState.data.open) closePopover(0);
		else openPopover();
		onclick?.();
	}}
	onmouseenter={handleEnter}
	onmouseleave={handleLeave}
	onfocus={handleEnter}
	onblur={handleLeave}
	aria-haspopup={ariaHaspopup ?? 'dialog'}
	aria-expanded={uiState.data?.open ? 'true' : 'false'}
	aria-controls={ariaControls ?? `popover-${String(key)}-content`}
	aria-label={ariaLabel}
	id={id ?? `popover-${String(key)}-controls`}
>
	{@render children?.()}
</Button>
