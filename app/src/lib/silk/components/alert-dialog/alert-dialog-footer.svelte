<script lang="ts">
	import { states, UIState, useState } from '$lib/silk/internals/state.svelte.ts';
	import { getContext, setContext } from 'svelte';
	import type { AlertDialogState } from ".";
    import { Button, type ButtonProps } from "$lib/silk/components/button";
    import { cn, type DefaultProps } from "$lib/silk/utils";

    type Props = {} & DefaultProps;

    let { class: className, children, ...rest }: Props = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as AlertDialogState;
</script>

<div
	{...rest}
	class={cn(
		className,
		`flex flex-col-reverse w-full sm:flex-row mt-6 gap-2 justify-end items-center`
	)}
>
	{@render children?.()}
</div>
