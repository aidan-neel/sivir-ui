<script lang="ts">
    import { Button, type ButtonProps } from "$lib/ui/components/button";
	import { states } from "$lib/ui/internals/state.svelte";
	import { cn } from "$lib/ui/utils";
	import { getContext, onDestroy, onMount, setContext, tick, type Snippet } from 'svelte';
	import type { HTMLAttributes } from "svelte/elements";
    import Check from "@lucide/svelte/icons/check";
	import { flyAndScale } from "$lib/ui/internals/transition";
	import type { ComboboxItem, ComboboxState } from ".";

    const key = getContext('key') as string;
    const parent = getContext('parent') as string;
    const uiState = states[key].data as ComboboxState;

    type Props = {
        class?: string;
        value: string;
        label: string;
        callback?: () => void;
    } & ButtonProps;

    let { label, value, class: className, callback, ...rest }: Props = $props();
    let el = $state<HTMLButtonElement | HTMLAnchorElement | undefined>();
    let item: ComboboxItem = $derived({
        value: value,
        label: label,
        callback: callback,
        ref: el
    }) as ComboboxItem

    async function close() {
        uiState.selected = item;
        setTimeout(() => {
            uiState.open = false;
            uiState.searchContent = '';
        }, 1)
        callback?.();
    }

    onMount(() => {
        if (!uiState.items.has(item)) {
            uiState.items.add(item)
        }
    })
</script>

{#if uiState.searchContent === ''}
    <Button bind:element={el} {...rest} onclick={close} class={cn(className, "w-full font-normal h-8 duration-100 rounded-lg gap-1 hover:cursor-default px-2 hover:bg-muted/50 items-center justify-start text-left")} variant={"ghost"}>
        <div class="size-3">
            {#if uiState.selected}
                {#if uiState.selected.value === item.value}
                    <Check class="size-3" />
                {/if}
            {/if}
        </div>
        {label}
    </Button>
{:else}
    <Button
        bind:element={el}
        {...rest}
        onclick={close}
        class={cn(
            className,
            "w-full h-8 duration-100 rounded-lg gap-1 hover:cursor-default px-2 hover:bg-muted/50 items-center justify-start text-left",
            uiState.searchContent !== '' && !Array.from(uiState.results).some(r => r.value === item.value) && "hidden"        
        )}
        variant="ghost"
    >
        <div class="size-3">
            {#if uiState.selected}
                {#if uiState.selected.value === item.value}
                    <Check class="size-3" />
                {/if}
            {/if}
        </div>
        {label}
    </Button>
{/if}