<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';
	import { getContext, type Snippet } from 'svelte';
    import { ChevronDown } from '@lucide/svelte';
    import { states } from '$lib/ui/internals/state.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { ButtonProps } from '$lib/ui/components/button';

    const key = getContext('key') as string;
    const uiState = states[key];

    type Props = {
        children: Snippet;
        class: string;
        variant?: string;
    } & ButtonProps

    let { children, class: className, variant, ...rest }: Props = $props();
</script>

<Popover.Trigger class={cn(className, `flex flex-row justify-between px-3 items-center ${uiState.data.value !== '' ? 'text-foreground' : 'text-foreground-muted'}`)} variant={variant} {...rest}>
    {#if uiState.data.value !== ''}
        {uiState.data.value
            .replace(/^./, (str: string) => str.toUpperCase())}
    {:else}
        {@render children?.()}
    {/if}
    <ChevronDown />
</Popover.Trigger>