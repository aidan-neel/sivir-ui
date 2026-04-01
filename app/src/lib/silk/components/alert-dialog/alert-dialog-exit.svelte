<script lang="ts">
	import { states, UIState, useState } from '$lib/silk/internals/state.svelte.ts';
	import { getContext, setContext } from 'svelte';
	import type { AlertDialogState } from ".";
    import { Button, type ButtonProps } from "$lib/silk/components/button";
    import { cn, type DefaultProps } from "$lib/silk/utils";

    type Props = {
        onclick?: () => any;
    } & DefaultProps & ButtonProps;

    let { class: className, children, onclick, ...rest }: Props = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as AlertDialogState;
</script>

<Button
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
