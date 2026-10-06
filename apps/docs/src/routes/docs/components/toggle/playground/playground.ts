export type ToggleVariant = 'default' | 'outline';

export type ToggleSize = 'sm' | 'md' | 'lg';

export type ToggleSettings = {
    variant: ToggleVariant;
    size: ToggleSize;
    pressed: boolean;
    disabled: boolean;
};

export const toggleDefaults: ToggleSettings = {
    variant: 'default',
    size: 'md',
    pressed: true,
    disabled: false
};

const ICON_SIZES: Record<ToggleSize, number> = {
    sm: 12,
    md: 14,
    lg: 16
};

export function toggleIconSize(size: ToggleSize) {
    return ICON_SIZES[size];
}

function toggleProps(settings: ToggleSettings) {
    const props = ['bind:pressed={bold}'];

    if (settings.variant !== 'default') {
        props.push(`variant="${settings.variant}"`);
    }
    if (settings.size !== 'md') {
        props.push(`size="${settings.size}"`);
    }
    if (settings.disabled) {
        props.push('disabled');
    }
    props.push('aria-label="Bold"');

    return props.join(' ');
}

export function toggleCode(settings: ToggleSettings) {
    return `<script lang="ts">
    import Bold from '@lucide/svelte/icons/bold';
    import { Toggle } from '@sivir-ui/svelte/components/toggle';

    let bold = $state(${settings.pressed});
</script>

<Toggle ${toggleProps(settings)}>
    <Bold size={${toggleIconSize(settings.size)}} />
</Toggle>
`;
}

export function changedToggleProps(settings: ToggleSettings) {
    const keys: (keyof ToggleSettings)[] = ['size', 'pressed', 'disabled'];

    return keys.filter((key) => {
        return settings[key] !== toggleDefaults[key];
    }).length;
}
