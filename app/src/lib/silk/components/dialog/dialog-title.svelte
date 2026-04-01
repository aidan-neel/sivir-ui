<script lang="ts">
	import { states, UIState, useState } from '$lib/silk/internals/state.svelte.ts';
	import { getContext, setContext } from 'svelte';
	import type { DialogState, DialogTitleProps } from '.';
	import { Button, type ButtonProps } from '$lib/silk/components/button';
	import { cn, type DefaultProps } from '$lib/silk/utils';

	let { class: className, children, ...rest }: DialogTitleProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<DialogState>;
</script>

<h1
	{...rest}
	id={uiState.key + '-title'}
	class={cn(
		className,
		`text-lg text-center sm:text-left font-medium tracking-[-0.02em] [font-family:var(--font-header),sans-serif]`
	)}
>
	{@render children?.()}
</h1>
