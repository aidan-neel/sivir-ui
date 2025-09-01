<script lang="ts">
	import { getContext } from "svelte";
	import type { ContextMenuItemProps, ContextMenuState } from ".";
	import { states } from "$lib/ui/internals/state.svelte";
    import { Button } from '$lib/ui/components/button';
	import { cn } from "$lib/ui/utils";

    const key = getContext<string>('key');
    const parent = getContext<string>('parent');
    const uiState = states[key].data as ContextMenuState;

    let { class: className, children, callback, inset = false, ...rest }: ContextMenuItemProps = $props();
</script>

<Button {...rest} onclick={() => {
    uiState.open = false;
    if (parent) {
        states[parent].data.open = false;
    }
    callback?.();
}} class={cn(className, `px-2 ${inset ? 'pl-8' : ''} font-normal w-full h-9 duration-100 rounded-lg hover:cursor-default text-sm items-center justify-between text-left`)} variant={"ghost"}>
    {@render children?.()}
</Button>