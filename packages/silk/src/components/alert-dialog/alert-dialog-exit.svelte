<script lang="ts">
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { getContext, onMount } from 'svelte';
	import type { AlertDialogState } from '.';
	import { Button, type ButtonProps } from '@silk/ui/components/button';
	import { cn, type DefaultProps } from '@silk/ui/utils';

	type Props = {
		onclick?: () => void;
	} & DefaultProps &
		ButtonProps;

	let { class: className, children, onclick, ...rest }: Props = $props();

	const key = getContext<string>('key');
	const uiState = states[key].data as AlertDialogState;
	let element = $state<HTMLButtonElement | HTMLAnchorElement | undefined>(undefined);

	onMount(() => {
		element?.focus();
	});
</script>

<Button
	bind:element
	onclick={() => {
		uiState.open = false;
		onclick?.();
	}}
	variant="ghost"
	{...rest}
	class={cn(className, `flex sm:w-fit w-full flex-row gap-2 justify-center items-center`)}
>
	{@render children?.()}
</Button>
