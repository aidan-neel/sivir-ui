<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { getContext } from 'svelte';
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import type { CommandState } from '.';

	const key = getContext('key') as string;
	const uiState = states[key].data as CommandState;

	const { children, class: classProp, ...rest }: ButtonProps = $props();

	function openCommand() {
		uiState.open = true;
	}
</script>

<Button
	{...rest}
	class={classProp}
	onclick={openCommand}
	aria-haspopup="dialog"
	aria-expanded={uiState.open}
	aria-controls={`command-${String(key)}`}
	id={`command-${String(key)}-trigger`}
>
	{#if children}
		{@render children?.()}
	{/if}
</Button>
