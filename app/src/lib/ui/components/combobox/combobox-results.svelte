<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '$lib/ui/components/button';
	import { computePosition, flip } from '@floating-ui/dom';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { states } from '$lib/ui/internals/state.svelte';
	import type { ComboboxState } from '.';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { flyAndScale } from '$lib/ui/internals/transition';
	import { clickOutside, cn } from '$lib/ui/utils';

	const key = getContext("key") as string;
	const uiState = states[key].data as ComboboxState;

    type Props = {
        children?: Snippet;
        class?: string;
        allowClickOutside?: boolean;
    }

	const { children, class: className, allowClickOutside = true, ...rest }: Props = $props();
</script>

<div class="overflow-y-auto max-h-full p-1">
    {#if uiState.searchContent === ''}
        {@render children?.()}
    {:else}
        {#if uiState.results.size > 0}
            {@render children?.()}
        {:else}
            <div class="w-full p-3 flex items-center justify-center">
                <p class="text-sm font-medium text-foreground-muted">
                    No results found
                </p>
            </div>
        {/if}
    {/if}
</div>