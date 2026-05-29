<script lang="ts">
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { ModalConfirmProps, ModalState } from '.';
	import { Button } from '@silk/ui/components/button';
	import { cn } from '@silk/ui/utils';

	let { class: className, children, onclick, ...rest }: ModalConfirmProps = $props();
	const key = getContext<string>('key');
	const uiState = states[key].data as ModalState;
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
