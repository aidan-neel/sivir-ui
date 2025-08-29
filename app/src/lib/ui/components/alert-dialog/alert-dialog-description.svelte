<script lang="ts">
	import { states, UIState, useState } from "$lib/ui/internals/state.svelte";
	import { getContext, setContext } from "svelte";
	import type { AlertDialogState } from ".";
    import { Button, type ButtonProps } from "$lib/ui/components/button";
    import { cn, type DefaultProps } from "$lib/ui/utils";

    type Props = {} & DefaultProps;

    let { class: className, children, ...rest }: Props = $props();

    const key = getContext<string>('key');
    const uiState = states[key] as UIState<AlertDialogState>;
</script>

<p {...rest} id={uiState.key + '-desc'} class={cn(className, `text-sm text-foreground-muted py-1`)}>
    {@render children?.()}
</p>