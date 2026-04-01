<script lang="ts">
	import { states, UIState, useState } from '$lib/silk/internals/state.svelte.ts';
	import { getContext, setContext } from 'svelte';
	import type { SheetState, SheetTriggerProps } from ".";
    import { Button, type ButtonProps } from "$lib/silk/components/button";
    import { cn, type DefaultProps } from "$lib/silk/utils";

    let { class: className, children, ...rest }: SheetTriggerProps = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as SheetState;
</script>

<Button
	onclick={() => {
		uiState.open = true;
	}}
	class={cn(className, ``)}
	{...rest}
>
	{@render children?.()}
</Button>
