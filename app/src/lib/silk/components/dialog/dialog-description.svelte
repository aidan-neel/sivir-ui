<script lang="ts">
	import { states, UIState, useState } from '$lib/silk/internals/state.svelte.ts';
	import { getContext, setContext } from 'svelte';
	import type { DialogDescriptionProps, DialogState } from ".";
    import { Button, type ButtonProps } from "$lib/silk/components/button";
    import { cn, type DefaultProps } from "$lib/silk/utils";

    let { class: className, children, ...rest }: DialogDescriptionProps = $props();

    const key = getContext<string>('key');
    const uiState = states[key] as UIState<DialogState>;
</script>

<p
	{...rest}
	id={uiState.key + '-desc'}
	class={cn(className, 'text-sm text-center [font-weight:var(--font-weight-body,400)] text-foreground-muted sm:text-left')}
>
	{@render children?.()}
</p>
