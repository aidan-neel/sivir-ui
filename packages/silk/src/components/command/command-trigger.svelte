<script lang="ts">
	import { Button, type ButtonProps } from '@silk/ui/components/button';
	import { getContext } from 'svelte';
	import { states } from '@silk/ui/internals/state.svelte.ts';
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
	aria-controls={`${String(key)}-content`}
	id={`${String(key)}-controls`}
>
	{#if children}
		{@render children?.()}
	{/if}
</Button>
