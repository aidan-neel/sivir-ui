<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
</script>

<Tooltip.Root placement="right">
    <Tooltip.Trigger>
        <button
            type="button"
            class="inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] text-foreground-muted transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Next"
        >
            <ChevronRight size={16} />
        </button>
    </Tooltip.Trigger>
    <Tooltip.Content>Next item</Tooltip.Content>
</Tooltip.Root>
