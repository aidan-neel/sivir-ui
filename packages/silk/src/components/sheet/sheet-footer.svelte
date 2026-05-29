<script lang="ts">
	import { cn } from "@silk/ui/utils";
	import type { SheetHeaderProps, SheetState } from ".";
	import Button from "@silk/ui/components/button";
    import X from "@lucide/svelte/icons/x"
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';

    let { class: className, children, ...rest }: SheetHeaderProps = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as SheetState;
</script>

<div {...rest} class={cn(className, `flex flex-col gap-2 mt-auto`)}>
	{@render children?.()}
</div>
