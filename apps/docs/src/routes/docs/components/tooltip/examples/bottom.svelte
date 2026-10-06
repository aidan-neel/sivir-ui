<script lang="ts">
    import HelpCircle from '@lucide/svelte/icons/help-circle';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
</script>

<Tooltip.Root placement="bottom">
    <Tooltip.Trigger>
        <button
            type="button"
            class="inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] text-foreground-muted transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Help"
        >
            <HelpCircle size={16} />
        </button>
    </Tooltip.Trigger>
    <Tooltip.Content>Learn more about this setting</Tooltip.Content>
</Tooltip.Root>
