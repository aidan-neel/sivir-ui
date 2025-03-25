<script lang="ts">
	import BackgroundBlur from '../internals/background-blur.svelte';
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { popoverUIState, getPopoverUIState, type PopoverUIState, STATE_KEY } from './lib.svelte';
	import type { UIState } from '$lib/ui/internals/dataState.svelte';
	import { clickOutside, cn } from '$lib/ui/utils';
	import { flyAndScale } from '$lib/ui/internals/transition';
	import { computePosition } from '@floating-ui/dom';

	const {
		children,
		class: classProp,
		allowClickOutside = true,
		...rest
	}: {
		children: Snippet;
		class?: string;
		allowClickOutside?: boolean;
	} = $props();

	const dataState: UIState<PopoverUIState> = getPopoverUIState();

	let popover: HTMLDivElement;
	let popoverHeight = 0;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			dataState.data.open = false;
		}
	}

	$effect(() => {
		document.addEventListener('keydown', handleKeydown);

		onDestroy(() => {
			document.removeEventListener('keydown', handleKeydown);
		});

		dataState.data.popoverRef = popover;

		if (allowClickOutside) {
			clickOutside(popover, () => {
				dataState.data.open = false;
			}, [dataState.data.buttonRef]);
		}
	});
</script>

<div class="flex items-center py-2 justify-center floating" bind:this={popover}>
	{#if dataState.data?.open}
		<div
			{...rest}
			transition:flyAndScale={{ duration: 200 }}
			class={cn(classProp, `p-3 text-sm rounded-lg border m-auto shadow-sm bg-background`)}
		>
			<p class="font-semibold">Popover</p>
			<p>This is the popover content</p>
		</div>
	{/if}
</div>
