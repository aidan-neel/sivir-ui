<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';
	import type { Snippet } from 'svelte';
    import type { CommandState } from '.';
    import { states } from '$lib/ui/internals/state.svelte';
    import { getContext } from 'svelte';

    const key = getContext('key') as string;
    const uiState = states[key].data as CommandState;

    type Props = {
        children: Snippet;
        class: string;
        heading: string;
    }

    let { children, class: className, heading, ...rest }: Props = $props();
</script>

<div {...rest} class="px-1 pt-1 flex flex-col">
    {#if uiState.searchContent === ''}
        <p class={cn(className, "text-xs select-none px-2 py-2 text-foreground-muted font-medium")}>
            {heading}
        </p>
    {/if}

    {@render children?.()}
</div>