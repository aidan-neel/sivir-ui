<script lang="ts">
	import { states, UIState, useState } from "$lib/ui/internals/state.svelte";
	import { getContext, setContext } from "svelte";
	import type { SheetState, SheetTriggerProps } from ".";
    import { Button, type ButtonProps } from "$lib/ui/components/button";
    import { cn, type DefaultProps } from "$lib/ui/utils";

    let { class: className, children, ...rest }: SheetTriggerProps = $props();
    
    const key = getContext<string>('key');
    const uiState = states[key].data as SheetState;
</script>

<Button variant="outlined" onclick={() => {
    uiState.open = false;
}} class={cn(className, ``)} {...rest}>
    {@render children?.()}
</Button>