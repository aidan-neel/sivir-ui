<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '$lib/ui/components/button';
	import { computePosition, flip } from '@floating-ui/dom';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { states } from '$lib/ui/internals/state.svelte';
	import type { CommandState } from '.';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { flyAndScale } from '$lib/ui/internals/transition';
	import { clickOutside, cn } from '$lib/ui/utils';

	const key = getContext("key") as string;
	const uiState = states[key].data as CommandState;

    type Props = {
        children?: Snippet;
        class?: string;
        allowClickOutside?: boolean;
    }

	let element: HTMLButtonElement | undefined = $state();
    let lastOpen = $state<boolean>(uiState.open);
	const { children, class: className, allowClickOutside = true, ...rest }: Props = $props();

    $effect(() => {
        if (uiState.open !== lastOpen) {
            lastOpen = uiState.open;

            if (uiState.open) {
                scrollY = window.scrollY;
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
                window.scrollTo(0, scrollY);
            }
        }
    });
</script>

{#if uiState.open}
    <div transition:fade={{ duration: 150, easing: cubicOut }} class="backdrop"></div>
    <div
        transition:flyAndScale
        class={cn(
            className,
            `${uiState.searchContent === '' ? 'pb-1' : 'pb-1'} rounded-xl border duration-200 transition-all fixed top-1/2 left-1/2 z-50 overflow-y-auto -translate-x-1/2 -translate-y-1/2 m-auto shadow-sm bg-popover w-full max-w-[35rem] min-h-[5rem] max-h-[20rem]`
        )}
        use:clickOutside={() => {
            if (allowClickOutside) {
                uiState.open = false;
            }
        }}
        >
        {@render children?.()}
    </div>
{/if}