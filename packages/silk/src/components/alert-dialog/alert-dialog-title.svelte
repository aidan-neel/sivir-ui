<script lang="ts">
	import { states, UIState, useState } from '@silk/ui/internals/state.svelte.ts';
	import { getContext, setContext } from 'svelte';
	import { ALERT_DIALOG_VARIANT_KEY, type AlertDialogState, type AlertDialogVariant } from '.';
	import { Button, type ButtonProps } from '@silk/ui/components/button';
	import { cn, type DefaultProps } from '@silk/ui/utils';

	type Props = {} & DefaultProps;

	let { class: className, children, ...rest }: Props = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<AlertDialogState>;

	const variant =
		(getContext(ALERT_DIALOG_VARIANT_KEY) as (() => AlertDialogVariant) | undefined)?.() ??
		'default';
	const titleClass =
		variant === 'spotlight'
			? 'text-center [font-family:var(--font-header)] text-[1.45rem] font-bold [letter-spacing:-0.01em] leading-tight'
			: 'text-center [font-family:var(--font-header)] [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)] sm:text-left';
</script>

<h1 {...rest} id={uiState.key + '-title'} class={cn(className, titleClass)}>
	{@render children?.()}
</h1>
