<script lang="ts">
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { getContext, onMount } from 'svelte';
	import type { ModalCloseProps, ModalState } from '.';
	import { Button } from '@silk/ui/components/button';
	import { cn } from '@silk/ui/utils';

	let { class: className, children, onclick, ...rest }: ModalCloseProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key].data as ModalState;
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
	variant="outline"
	{...rest}
	class={cn(className, `flex sm:w-fit w-full flex-row gap-2 justify-center items-center`)}
>
	{@render children?.()}
</Button>
