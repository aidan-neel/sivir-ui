<script lang="ts">
    import Info from '@lucide/svelte/icons/info';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
</script>

<Tooltip.Root placement="top">
    <Tooltip.Trigger>
        <button
            type="button"
            class="inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] text-foreground-muted transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="More info"
        >
            <Info size={16} />
        </button>
    </Tooltip.Trigger>
    <Tooltip.Content>Required for team accounts</Tooltip.Content>
</Tooltip.Root>
