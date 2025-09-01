<script lang="ts">
	import { flyAndScale, flyNoOpacity } from "$lib/ui/internals/transition";
	import { clickOutside, type DefaultProps, cn, trapFocus } from "$lib/ui/utils";
	import { cubicOut } from "svelte/easing";
	import { fade, fly } from "svelte/transition";
	import type { SheetContentProps, SheetState } from ".";
    import { getContext, onMount } from "svelte";
	import { states, UIState } from "$lib/ui/internals/state.svelte";

    let { class: className, allowClickOutside = true, children, side = 'right', ...rest }: SheetContentProps = $props();

    const key = getContext<string>('key');
    const uiState = states[key] as UIState<SheetState>;
        let element = $state<HTMLElement>();

    let cleanup: (() => void) | undefined;

    $effect(() => {
        if (!document) return;

        if (uiState.data.open) {
            cleanup = trapFocus(element as HTMLElement);
            document.body.style.overflow = 'hidden';
            const focusable = element!.querySelector<HTMLElement>(
                'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
            );
            focusable?.focus();
        } else {
            document.body.style.overflow = '';
            cleanup?.();
            cleanup = undefined;
        }
    })
</script>

{#if uiState.data.open}
    <div transition:fade={{ duration: 150, easing: cubicOut }} class="backdrop"></div>
    <div
        bind:this={element}
        transition:fly={{ x: 125, y: 0, duration: 300 }}
        class={cn(
            className,
            `p-4 border transition-all fixed flex flex-col top-0 right-0 z-50 overflow-y-auto m-auto shadow-sm bg-background w-full max-w-[25rem] h-screen`
        )}
        use:clickOutside={() => {
            if (allowClickOutside) {
                uiState.data.open = false;
            }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={uiState.key + '-title'}
        aria-describedby={uiState.key + '-desc'}
        tabindex="-1"
        {...rest}
        >
        {@render children?.()}
    </div>
{/if}