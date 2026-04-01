<script lang="ts">
	import { states, UIState, useState } from '$lib/silk/internals/state.svelte.ts';
	import { getContext, onMount, setContext } from 'svelte';
	import type { DialogConfirmProps, DialogState } from ".";
    import { Button, type ButtonProps } from "$lib/silk/components/button";
    import { cn, type DefaultProps } from "$lib/silk/utils";

    let { class: className, children, onclick, ...rest }: DialogConfirmProps = $props();

    let btn = $state<HTMLButtonElement | HTMLAnchorElement | undefined>(undefined);
    const key = getContext<string>('key');
    const uiState = states[key].data as DialogState;

    onMount(() => {
        if (btn) {
            btn.focus();
        }
    })
</script>

<Button
	bind:element={btn}
	onclick={() => {
		uiState.open = false;
		onclick?.();
	}}
	{...rest}
	class={cn(className, `flex sm:w-fit w-full flex-row gap-2 justify-center items-center`)}
>
	{@render children?.()}
</Button>
