<script lang="ts">
	import { states, UIState, useState } from "$lib/ui/internals/state.svelte";
	import { getContext, onMount, setContext } from "svelte";
	import type { AlertDialogState } from ".";
    import { Button, type ButtonProps } from "$lib/ui/components/button";
    import { cn, type DefaultProps } from "$lib/ui/utils";

    type Props = {
        onclick: () => any;
    } & DefaultProps & ButtonProps;

    let { class: className, children, onclick, ...rest }: Props = $props();

    let btn = $state<HTMLButtonElement | HTMLAnchorElement | undefined>(undefined);
    const key = getContext<string>('key');
    const uiState = states[key].data as AlertDialogState;

    onMount(() => {
        if (btn) {
            btn.focus();
        }
    })
</script>

<Button bind:element={btn} onclick={() => {
    uiState.open = false;
    onclick?.();
}} {...rest} class={cn(className, `flex sm:w-fit w-full flex-row gap-2 justify-center items-center`)}>
    {@render children?.()}
</Button>