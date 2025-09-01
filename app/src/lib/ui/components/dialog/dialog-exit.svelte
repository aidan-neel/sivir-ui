<script lang="ts">
	import { states, UIState, useState } from "$lib/ui/internals/state.svelte";
	import { getContext, setContext } from "svelte";
	import type { DialogExitProps, DialogState } from ".";
    import { Button, type ButtonProps } from "$lib/ui/components/button";
    import { cn, type DefaultProps } from "$lib/ui/utils";

    let { class: className, children, onclick, ...rest }: DialogExitProps = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as DialogState;
</script>

<Button onclick={() => {
    uiState.open = false;
    onclick?.();
}} variant="outlined" {...rest} class={cn(className, `flex sm:w-fit w-full flex-row gap-2 justify-center items-center`)}>
    {@render children?.()}
</Button>