<script lang="ts">
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { AlertDialogState } from '.';
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn, type DefaultProps } from '@sivir/ui/utils';

	type Props = {
		onclick?: () => void;
	} & DefaultProps &
		ButtonProps;

	let { class: className, children, onclick, ...rest }: Props = $props();
	const key = getContext<string>('key');
	const uiState = states[key].data as AlertDialogState;
</script>

<Button
	onclick={() => {
		uiState.open = false;
		onclick?.();
	}}
	{...rest}
	class={cn(className, `flex sm:w-fit w-full flex-row gap-2 justify-center items-center`)}
>
	{@render children?.()}
</Button>
