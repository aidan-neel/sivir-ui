<script lang="ts">
	import { cn } from "$lib/ui/utils";
	import type { SheetHeaderProps, SheetState } from ".";
	import Button from "$lib/ui/components/button";
    import X from "@lucide/svelte/icons/x"
	import { states } from "$lib/ui/internals/state.svelte";
	import { getContext } from "svelte";

    let { class: className, children, ...rest }: SheetHeaderProps = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as SheetState;
</script>

<div {...rest} class={cn(className, `flex flex-col gap-1 pb-6`)}>
    {@render children?.()}
    <Button onclick={() => {
        uiState.open = false;
    }} class="absolute top-3 right-3 size-8 text-foreground-muted" variant="ghost">
        <X />
    </Button>
</div>