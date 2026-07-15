<script lang="ts">
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext, onMount } from 'svelte';
	import type { ModalCloseProps, ModalState } from '.';
	import { Button } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import { useIsDark } from '@sivir/ui/internals/is-dark.svelte.ts';

	let { class: className, children, onclick, ...rest }: ModalCloseProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key].data as ModalState;
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
