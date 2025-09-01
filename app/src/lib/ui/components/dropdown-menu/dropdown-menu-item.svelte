<script lang="ts">
    import { Button, type ButtonProps } from "$lib/ui/components/button";
	import { states } from "$lib/ui/internals/state.svelte";
	import { cn } from "$lib/ui/utils";
	import { getContext, setContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from "svelte/elements";
    import Check from "@lucide/svelte/icons/check";
	import { flyAndScale } from "$lib/ui/internals/transition";

    const key = getContext('key') as string;
    const parent = getContext('parent') as string;
    const uiState = states[key];

    type Props = {
        class: string;
        children?: Snippet;
        callback?: () => any;
    } & ButtonProps;

    let { children, class: className, callback, ...rest }: Props = $props();

    setContext('callback', callback);
</script>

<Button role="menuitem" {...rest} onclick={() => {
    uiState.data.open = false;
    setTimeout(() => {
        if (parent) {
            states[parent].data.open = false;
        }
    }, 100)
    callback?.();
}} class={cn(className, "w-full h-9 duration-100 rounded-lg font-normal hover:cursor-default px-3 items-center justify-between text-left")} variant={"ghost"}>
    {@render children?.()}
</Button>