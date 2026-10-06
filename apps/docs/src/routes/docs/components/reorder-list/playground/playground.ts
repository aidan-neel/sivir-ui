export type ReorderListSettings = {
    disabled: boolean;
};

export const reorderListDefaults: ReorderListSettings = {
    disabled: false
};

export function reorderListCode(settings: ReorderListSettings) {
    const props = ['bind:items', '{getId}', '{getLabel}', 'label="List"'];

    if (settings.disabled) {
        props.push('disabled');
    }

    return `<script lang="ts">
    import { ReorderList } from '@sivir-ui/svelte/components/reorder-list';

    type Item = {
        id: string;
        label: string;
    };

    let items = $state<Item[]>([
        { id: '1', label: 'Item one' },
        { id: '2', label: 'Item two' },
        { id: '3', label: 'Item three' }
    ]);

    function getId(item: Item) {
        return item.id;
    }

    function getLabel(item: Item) {
        return item.label;
    }
</script>

<ReorderList ${props.join(' ')}>
    {#snippet children(item)}
        <span class="truncate text-sm font-medium">{item.label}</span>
    {/snippet}
</ReorderList>
`;
}

export function changedReorderListProps(settings: ReorderListSettings) {
    return settings.disabled === reorderListDefaults.disabled ? 0 : 1;
}
