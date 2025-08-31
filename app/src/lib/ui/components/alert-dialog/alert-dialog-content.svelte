<script lang="ts">
	import { flyAndScale } from "$lib/ui/internals/transition";
	import { clickOutside, type DefaultProps, cn } from "$lib/ui/utils";
	import { cubicOut } from "svelte/easing";
	import { fade } from "svelte/transition";
	import type { AlertDialogState } from ".";
    import { getContext, onMount } from "svelte";
	import { states, UIState } from "$lib/ui/internals/state.svelte";

    type Props = {
        allowClickOutside?: boolean;
    } & DefaultProps;

    let { class: className, allowClickOutside = true, children, ...rest }: Props = $props();

    const key = getContext<string>('key');
    const uiState = states[key] as UIState<AlertDialogState>;
</script>

{#if uiState.data.open}
    <div transition:fade={{ duration: 150, easing: cubicOut }} class="backdrop"></div>
    <div
        transition:flyAndScale
        class={cn(
            className,
            `p-5 rounded-xl border duration-200 transition-all fixed top-1/2 left-1/2 z-50 overflow-y-auto -translate-x-1/2 -translate-y-1/2 m-auto shadow-sm bg-popover w-full max-w-[35rem] min-h-[5rem] max-h-[20rem]`
        )}
        use:clickOutside={() => {
            if (allowClickOutside) {
                uiState.data.open = false;
            }
        }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={uiState.key + '-title'}
        aria-describedby={uiState.key + '-desc'}
        tabindex="-1"
        {...rest}
        >
        {@render children?.()}
    </div>
{/if}