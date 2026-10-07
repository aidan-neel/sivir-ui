<script lang="ts">
    import LayoutGrid from '@lucide/svelte/icons/layout-grid';
    import List from '@lucide/svelte/icons/list';
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';

    let view = $state('list');
</script>

<ToggleGroup.Root type="single" bind:value={view}>
    <ToggleGroup.Item value="list" aria-label="List view">
        <List size={14} />
    </ToggleGroup.Item>
    <ToggleGroup.Item value="grid" aria-label="Grid view">
        <LayoutGrid size={14} />
    </ToggleGroup.Item>
</ToggleGroup.Root>
