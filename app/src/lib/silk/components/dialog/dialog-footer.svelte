<script lang="ts">
	import { states, UIState, useState } from '$lib/silk/internals/state.svelte.ts';
	import { getContext, setContext } from 'svelte';
	import type { DialogFooterProps, DialogState } from ".";
    import { Button, type ButtonProps } from "$lib/silk/components/button";
    import { cn, type DefaultProps } from "$lib/silk/utils";

    let { class: className, children, ...rest }: DialogFooterProps = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as DialogState;
</script>

<div
	{...rest}
	class={cn(className, `flex flex-col-reverse sm:flex-row mt-1 gap-2 justify-end items-center`)}
>
	{@render children?.()}
</div>
