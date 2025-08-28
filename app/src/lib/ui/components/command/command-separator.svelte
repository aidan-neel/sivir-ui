<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';
	import { getContext, type Snippet } from 'svelte';
    import type { CommandState } from '.';
    import { states } from '$lib/ui/internals/state.svelte';

    const key = getContext('key') as string;
    const uiState = states[key].data as CommandState;

    type Props = {
        children?: Snippet;
        class?: string;
    }

    let { children, class: className, ...rest }: Props = $props();
</script>

{#if uiState.searchContent === ''}
    <div {...rest} class={cn(className, "h-[1px] my-1 bg-border")}>
        {@render children?.()}
    </div>
{/if}