<script lang="ts">
    import * as HoverCard from '@sivir-ui/svelte/components/hover-card';
    import type { SourceRootProps } from '.';
    import { setSourceContext } from './context.svelte';
    import SourceChip from './source-chip.svelte';

    let {
        open = $bindable(false),
        count = 1,
        openDelay = 150,
        closeDelay = 150,
        children,
        ...rest
    }: SourceRootProps = $props();

    setSourceContext({
        get count() {
            return count;
        }
    });
</script>

<HoverCard.Root bind:open {openDelay} {closeDelay}>
    <SourceChip {...rest}> {@render children?.()} </SourceChip>
</HoverCard.Root>
