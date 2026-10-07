<script lang="ts">
    import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';

    let {
        showCues = true,
        blur = false
    }: {
        showCues?: boolean;
        blur?: boolean;
    } = $props();

    const items = Array.from(
        {
            length: 10
        },
        (_, i) => {
            return `Item ${i + 1}`;
        }
    );
</script>

<ScrollArea {showCues} {blur} class="h-48 w-48 rounded-[var(--radius-md)] border border-border p-3">
    <div class="space-y-2">
        {#each items as item (item)}
            <div class="text-sm">{item}</div>
        {/each}
    </div>
</ScrollArea>
