<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '$lib/ui/components/button';
	import { computePosition, flip } from '@floating-ui/dom';
	import { getContext, onMount } from 'svelte';
	import { states } from '$lib/ui/internals/state.svelte';
	import type { CommandState } from '.';

	const key = getContext("key") as string;
	const uiState = states[key].data as CommandState;

	let element: HTMLButtonElement | undefined = $state();
	const { children, class: classProp, ...rest }: ButtonProps = $props();

	function openCommand() {
        uiState.open = true;
    }
</script>

<Button
	bind:element
	{...rest}
	class={classProp}
	onclick={openCommand}
	aria-haspopup="dialog"
	aria-expanded="true"
	aria-controls={`${String(key)}-content`}
	id={`${String(key)}-controls`}
>
	{#if children}
		{@render children?.()}
	{/if}
</Button>
