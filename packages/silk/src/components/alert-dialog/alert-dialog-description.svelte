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

<p
	{...rest}
	id={uiState.key + '-desc'}
	class={cn(
		className,
		'text-center [font-size:var(--font-size-body,16px)] font-medium [letter-spacing:var(--tracking-body,0em)] text-pretty text-foreground-muted sm:text-left'
	)}
>
	{@render children?.()}
</p>
