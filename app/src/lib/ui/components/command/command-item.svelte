<script lang="ts">
    import { Button, type ButtonProps } from "$lib/ui/components/button";
	import { states } from "$lib/ui/internals/state.svelte";
	import { cn } from "$lib/ui/utils";
	import { getContext, onDestroy, onMount, setContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from "svelte/elements";
    import Check from "@lucide/svelte/icons/check";
	import { flyAndScale } from "$lib/ui/internals/transition";
	import type { CommandItem, CommandState } from ".";

    const key = getContext('key') as string;
    const parent = getContext('parent') as string;
    const uiState = states[key].data as CommandState;

    type Props = {
        class?: string;
        name: string;
        children?: Snippet;
        callback?: () => void;
    } & ButtonProps;

    let { children, name, class: className, callback, ...rest }: Props = $props();
    let el = $state<HTMLButtonElement | HTMLAnchorElement | undefined>();
    let item: CommandItem = $derived({
        name: name,
        callback: callback,
        ref: el
    }) as CommandItem

    onMount(() => {
        if (!uiState.items.has(item)) {
            uiState.items.add(item)
        }
    })
</script>

{#if uiState.searchContent === ''}
    <Button bind:element={el} {...rest} onclick={() => {
        uiState.open = false;
        uiState.searchContent = '';
        callback?.();
    }} class={cn(className, "w-full h-10 duration-100 rounded-lg gap-2 hover:cursor-default px-3 items-center justify-start text-left")} variant={"ghost"}>
        {@render children?.()}
    </Button>
{:else}
    <Button
        bind:element={el}
        {...rest}
        onclick={() => {
            uiState.open = false;
            uiState.searchContent = '';
            callback?.();
        }}
        class={cn(
            className,
            "w-full h-10 duration-100 rounded-lg gap-2 hover:cursor-default px-3 items-center justify-start text-left",
            uiState.searchContent !== '' && !Array.from(uiState.results).some(r => r.name === item.name) && "hidden"
        )}
        variant="ghost"
    >
        {@render children?.()}
    </Button>
{/if}