<script lang="ts">
	import { cn } from "$lib/ui/utils";
	import type { DialogHeaderProps, DialogState } from ".";
	import Button from "$lib/ui/components/button";
    import X from "@lucide/svelte/icons/x"
	import { states } from "$lib/ui/internals/state.svelte";
	import { getContext } from "svelte";

    let { class: className, children, ...rest }: DialogHeaderProps = $props();

    const key = getContext<string>('key');
    const uiState = states[key].data as DialogState;
</script>

<div {...rest} class={cn(className, `flex flex-col`)}>
    {@render children?.()}
    <Button onclick={() => {
        uiState.open = false;
    }} class="absolute top-3 right-3 size-8 text-foreground-muted" variant="ghost">
        <X />
    </Button>
</div>