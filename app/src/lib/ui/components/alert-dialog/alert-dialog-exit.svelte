<script lang="ts">
	import { states, UIState, useState } from "$lib/ui/internals/state.svelte";
	import { getContext, setContext } from "svelte";
	import type { AlertDialogState } from ".";
    import { Button, type ButtonProps } from "$lib/ui/components/button";
    import { cn, type DefaultProps } from "$lib/ui/utils";

    type Props = {
        onclick: () => any;
    } & DefaultProps & ButtonProps;

    let { class: className, children, onclick, ...rest }: Props = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as AlertDialogState;
</script>

<Button onclick={() => {
    uiState.open = false;
    onclick?.();
}} variant="outlined" {...rest} class={cn(className, `flex flex-row gap-2 justify-end items-center`)}>
    {@render children?.()}
</Button>