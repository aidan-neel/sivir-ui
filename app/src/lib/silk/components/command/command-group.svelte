<script lang="ts">
    import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';
	import type { Snippet } from 'svelte';
    import type { CommandState } from '.';
    import { states } from '$lib/silk/internals/state.svelte.ts';
    import { getContext } from 'svelte';

    const key = getContext('key') as string;
    const uiState = states[key].data as CommandState;

    type Props = {
        children: Snippet;
        class?: string;
        heading: string;
    }

    let { children, class: className, heading, ...rest }: Props = $props();
</script>

<div {...rest} class="px-1 pt-1 flex flex-col">
	{#if uiState.searchContent === ''}
		<p class={cn(className, 'text-[length:var(--text-xs)] font-medium text-[var(--menu-label-foreground)] select-none px-2 pb-3 pt-1')}>
			{heading}
		</p>
	{/if}

	{@render children?.()}
</div>
