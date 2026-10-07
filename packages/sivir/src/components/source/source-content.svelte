<script lang="ts">
    import * as HoverCard from '@sivir-ui/svelte/components/hover-card';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount } from 'svelte';
    import type { SourceContentProps } from '.';

    let { class: className, children, ...rest }: SourceContentProps = $props();

    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });
</script>

{#if mounted}
    <HoverCard.Content
        {...rest}
        align="start"
        data-ui="source-content"
        class={cn(className, 'w-80')}
    >
        <div class="flex flex-col gap-3">
            {@render children?.()}
        </div>
    </HoverCard.Content>
{/if}
