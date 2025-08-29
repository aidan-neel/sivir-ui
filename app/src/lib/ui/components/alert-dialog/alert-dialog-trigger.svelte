<script lang="ts">
	import { states, UIState, useState } from "$lib/ui/internals/state.svelte";
	import { getContext, setContext } from "svelte";
	import type { AlertDialogState } from ".";
    import { Button, type ButtonProps } from "$lib/ui/components/button";
    import { cn, type DefaultProps } from "$lib/ui/utils";

    type Props = {} & DefaultProps & ButtonProps;

    let { class: className, children, ...rest }: Props = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as AlertDialogState;
</script>

<Button onclick={() => {
    uiState.open = true;
}} class={cn(className, ``)} {...rest}>
    {@render children?.()}
</Button>