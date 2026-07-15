<script lang="ts">
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext, onMount } from 'svelte';
	import type { AlertDialogState } from '.';
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn, type DefaultProps } from '@sivir/ui/utils';
	import { useIsDark } from '@sivir/ui/internals/is-dark.svelte.ts';

	type Props = {
		onclick?: () => void;
	} & DefaultProps &
		ButtonProps;

	let { class: className, children, onclick, ...rest }: Props = $props();

	const key = getContext<string>('key');
	const uiState = states[key].data as AlertDialogState;
	let element = $state<HTMLButtonElement | HTMLAnchorElement | undefined>(undefined);

	// Cancel reads as outline in light, ghost in dark.
	const isDark = useIsDark();
	const cancelVariant = $derived(isDark.current ? 'ghost' : 'outline');

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
	variant={cancelVariant}
	{...rest}
	class={cn(className, `flex sm:w-fit w-full flex-row gap-2 justify-center items-center`)}
>
	{@render children?.()}
</Button>
