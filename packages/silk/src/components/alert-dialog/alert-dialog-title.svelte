<script lang="ts">
	import { states, UIState, useState } from '@silk/ui/internals/state.svelte.ts';
	import { getContext, setContext } from 'svelte';
	import type { AlertDialogState } from '.';
	import { Button, type ButtonProps } from '@silk/ui/components/button';
	import { cn, type DefaultProps } from '@silk/ui/utils';

	type Props = {} & DefaultProps;

	let { class: className, children, ...rest }: Props = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<AlertDialogState>;
</script>

<h1
	{...rest}
	id={uiState.key + '-title'}
	class={cn(
		className,
		'text-center [font-family:var(--font-header)] [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)] text-balance sm:text-left'
	)}
>
	{@render children?.()}
</h1>
