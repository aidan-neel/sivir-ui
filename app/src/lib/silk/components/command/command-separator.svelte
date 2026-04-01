<script lang="ts">
    import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';
	import { getContext, type Snippet } from 'svelte';
    import type { CommandState } from '.';
    import { states } from '$lib/silk/internals/state.svelte.ts';

    const key = getContext('key') as string;
    const uiState = states[key].data as CommandState;

    type Props = {
        children?: Snippet;
        class?: string;
    }

    let { children, class: className, ...rest }: Props = $props();
</script>

{#if uiState.searchContent === ''}
	<div
		{...rest}
		data-ui="menu-separator"
		class={cn(className, 'bg-[var(--separator-color)] rounded-[var(--radius-pill)] h-[var(--border-size)] w-[calc(100%-1.5rem)] mx-auto my-1')}
	>
		{@render children?.()}
	</div>
{/if}
