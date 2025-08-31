<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { ContextMenuContentProps, ContextMenuState } from '.';
	import { states } from '$lib/ui/internals/state.svelte';

    const key = getContext<string>('key');
    const uiState = states[key].data as ContextMenuState;

    let { class: className, children, ...rest }: ContextMenuContentProps = $props();
</script>

<Popover.Content refElement={uiState.virtualElement} {...rest} class={cn(className, "p-1")}>
    {@render children?.()}
</Popover.Content>