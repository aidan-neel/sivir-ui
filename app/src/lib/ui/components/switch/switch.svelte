<script lang="ts">
    import type { SwitchState, SwitchProps } from ".";
    import { states, useState } from "$lib/ui/internals/state.svelte";
	import { cn } from "$lib/ui/utils";

    let { switched = $bindable(false), label, class: className, children, ...rest }: SwitchProps = $props();

    const uiState = useState<SwitchState>({
        switched: switched
    })
</script>

<div class="flex flex-row gap-2 items-center">
    <button {...rest} aria-label={label} id={uiState.key} aria-labelledby={uiState.key + '-label'} onclick={() => {
        switched = !switched;
    }} class={cn(className, `${switched ? 'bg-primary' : 'bg-secondary'} duration-100 w-9 h-5 p-0.5 rounded-full relative`)}>
        <div
            class="w-1/2 h-full rounded-full bg-white transition-transform duration-200 ease-in-out"
            class:translate-x-full={switched}
        ></div>
    </button>
    {#if label}
        <label class="text-sm font-medium text-foreground" for={uiState.key} id={uiState.key + '-label'}>
            {label}
        </label>
    {/if}
</div>