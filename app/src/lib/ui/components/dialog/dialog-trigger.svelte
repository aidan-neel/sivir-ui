<script lang="ts">
	import { states, UIState, useState } from "$lib/ui/internals/state.svelte";
	import { getContext, setContext } from "svelte";
	import type { DialogState, DialogTriggerProps } from ".";
    import { Button, type ButtonProps } from "$lib/ui/components/button";
    import { cn, type DefaultProps } from "$lib/ui/utils";

    let { class: className, children, ...rest }: DialogTriggerProps = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as DialogState;
</script>

<Button
aria-haspopup="dialog"
onclick={() => {
    uiState.open = true;
}} class={cn(className, ``)} {...rest}>
    {@render children?.()}
</Button>