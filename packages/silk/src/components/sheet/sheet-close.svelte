<script lang="ts">
	import { states, UIState, useState } from '@silk/ui/internals/state.svelte.ts';
	import { getContext, setContext } from 'svelte';
	import type { SheetState, SheetTriggerProps } from ".";
    import { Button, type ButtonProps } from "@silk/ui/components/button";
    import { cn, type DefaultProps } from "@silk/ui/utils";

    let { class: className, children, ...rest }: SheetTriggerProps = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as SheetState;
</script>

<Button
	variant="outlined"
	onclick={() => {
		uiState.open = false;
	}}
	class={cn(className, ``)}
	{...rest}
>
	{@render children?.()}
</Button>
