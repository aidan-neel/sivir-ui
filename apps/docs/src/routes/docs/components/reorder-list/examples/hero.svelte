<script lang="ts">
    import { ReorderList } from '@sivir-ui/svelte/components/reorder-list';

    type Item = {
        id: string;
        label: string;
    };

    let {
        disabled = false
    }: {
        disabled?: boolean;
    } = $props();

    let items = $state<Item[]>([
        {
            id: '1',
            label: 'Item one'
        },
        {
            id: '2',
            label: 'Item two'
        },
        {
            id: '3',
            label: 'Item three'
        }
    ]);

    function getId(item: Item) {
        return item.id;
    }

    function getLabel(item: Item) {
        return item.label;
    }
</script>

<ReorderList bind:items {getId} {getLabel} label="List" {disabled}>
    {#snippet children(item)}
        <span class="truncate text-sm font-medium">{item.label}</span>
    {/snippet}
</ReorderList>
