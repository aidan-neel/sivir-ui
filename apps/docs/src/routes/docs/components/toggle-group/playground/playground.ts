export type ToggleGroupType = 'single' | 'multiple';

export type ToggleGroupSettings = {
    type: ToggleGroupType;
    disabled: boolean;
};

export const toggleGroupDefaults: ToggleGroupSettings = {
    type: 'single',
    disabled: false
};

function rootProps(settings: ToggleGroupSettings) {
    const props: string[] = [];

    if (settings.type !== 'single') {
        props.push(`type="${settings.type}"`);
    }
    props.push('bind:value={alignment}');

    if (settings.disabled) {
        props.push('disabled');
    }
    return props.join(' ');
}

export function toggleGroupCode(settings: ToggleGroupSettings) {
    const initial = settings.type === 'multiple' ? "['center']" : "'center'";

    return `<script lang="ts">
    import AlignCenter from '@lucide/svelte/icons/align-center';
    import AlignLeft from '@lucide/svelte/icons/align-left';
    import AlignRight from '@lucide/svelte/icons/align-right';
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';

    let alignment = $state(${initial});
</script>

<ToggleGroup.Root ${rootProps(settings)}>
    <ToggleGroup.Item value="left" aria-label="Align left">
        <AlignLeft size={14} />
    </ToggleGroup.Item>
    <ToggleGroup.Item value="center" aria-label="Align center">
        <AlignCenter size={14} />
    </ToggleGroup.Item>
    <ToggleGroup.Item value="right" aria-label="Align right">
        <AlignRight size={14} />
    </ToggleGroup.Item>
</ToggleGroup.Root>
`;
}

export function changedToggleGroupProps(settings: ToggleGroupSettings) {
    const keys = Object.keys(toggleGroupDefaults) as (keyof ToggleGroupSettings)[];

    return keys.filter((key) => {
        return settings[key] !== toggleGroupDefaults[key];
    }).length;
}
