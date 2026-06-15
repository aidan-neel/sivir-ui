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
	const descriptionClass =
		variant === 'spotlight'
			? 'text-center text-[0.95rem] [font-weight:var(--font-weight-body,400)] leading-relaxed text-foreground-muted'
			: 'text-center [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted sm:text-left';
</script>

<p {...rest} id={uiState.key + '-desc'} class={cn(className, descriptionClass)}>
	{@render children?.()}
</p>
