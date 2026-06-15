<script lang="ts">
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import { ALERT_DIALOG_VARIANT_KEY, type AlertDialogState, type AlertDialogVariant } from '.';
	import { Button, type ButtonProps } from '@silk/ui/components/button';
	import { cn, type DefaultProps } from '@silk/ui/utils';

	type Props = {
		onclick?: () => void;
	} & DefaultProps &
		ButtonProps;

	let { class: className, children, onclick, ...rest }: Props = $props();
	const key = getContext<string>('key');
	const uiState = states[key].data as AlertDialogState;

	const variant =
		(getContext(ALERT_DIALOG_VARIANT_KEY) as (() => AlertDialogVariant) | undefined)?.() ??
		'default';
	const confirmClass =
		variant === 'spotlight'
			? 'flex h-11 w-full flex-row items-center justify-center gap-2 rounded-xl text-[0.95rem]'
			: 'flex sm:w-fit w-full flex-row gap-2 justify-center items-center';
</script>

<Button
	onclick={() => {
		uiState.open = false;
		onclick?.();
	}}
	{...rest}
	class={cn(className, confirmClass)}
>
	{@render children?.()}
</Button>
