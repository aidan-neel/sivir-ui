export type SwitchSettings = {
    label: boolean;
    description: boolean;
    disabled: boolean;
};

export const switchDefaults: SwitchSettings = {
    label: true,
    description: false,
    disabled: false
};

export const switchContent = {
    label: 'Push notifications',
    description: 'Alerts for mentions and replies on this device.'
};

function switchProps(settings: SwitchSettings) {
    const props = ['bind:checked={enabled}'];

    if (settings.label) {
        props.push(`label="${switchContent.label}"`);
    } else {
        props.push(`aria-label="${switchContent.label}"`);
    }
    if (settings.description) {
        props.push(`description="${switchContent.description}"`);
    }
    if (settings.disabled) {
        props.push('disabled');
    }
    return props;
}

function switchElement(props: string[]) {
    if (props.length <= 2) {
        return `<Switch ${props.join(' ')} />`;
    }

    const stacked = props
        .map((prop) => {
            return `    ${prop}`;
        })
        .join('\n');

    return `<Switch\n${stacked}\n/>`;
}

export function switchCode(settings: SwitchSettings) {
    return `<script lang="ts">
    import { Switch } from '@sivir-ui/svelte/components/switch';

    let enabled = $state(true);
</script>

${switchElement(switchProps(settings))}
`;
}

export function changedSwitchProps(settings: SwitchSettings) {
    const keys = Object.keys(switchDefaults) as (keyof SwitchSettings)[];

    return keys.filter((key) => {
        return settings[key] !== switchDefaults[key];
    }).length;
}
