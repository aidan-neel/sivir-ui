<script lang="ts">
    import { Button, type ButtonProps } from "$lib/ui/components/button";
	import { states } from "$lib/ui/internals/state.svelte";
	import { cn } from "$lib/ui/utils";
	import { getContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from "svelte/elements";
    import Check from "@lucide/svelte/icons/check";
	import { flyAndScale } from "$lib/ui/internals/transition";

    const key = getContext('key') as string;
    const uiState = states[key];

    type Props = {
        value: string;
    } & ButtonProps;

    let props: Props = $props();

    uiState.data.values.add(props.value);
</script>

<Button onclick={() => {
    uiState.data.value = props.value;
    setTimeout(() => {
        uiState.data.open = false;
    }, 1)
}} {...props} class={cn(props.class, "w-full hover:cursor-default font-normal h-8 duration-100 px-2 hover:bg-muted/50 items-center justify-between text-left")} variant={"ghost"}>
    {@render props.children?.()}

    {#if uiState.data.value === props.value}
        <div>
            <Check />
        </div>
    {/if}
</Button>