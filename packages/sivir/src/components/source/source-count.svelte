<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SourceCountProps } from '.';
    import { getSourceContext } from './context.svelte';

    let { class: className, ...rest }: SourceCountProps = $props();

    const source = getSourceContext();
    const more = $derived(source.count - 1);
</script>

{#if more > 0}
    <span {...rest} data-ui="source-count" class={cn(className, 'tabular-nums opacity-70')}>
        <span aria-hidden="true">+{more}</span>
        <span class="sr-only">and {more} more {more === 1 ? 'source' : 'sources'}</span>
    </span>
{/if}
