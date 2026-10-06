export type RadioGroupSettings = {
    disabled: boolean;
    descriptions: boolean;
};

export const radioGroupDefaults: RadioGroupSettings = {
    disabled: false,
    descriptions: false
};

export const radioGroupOptions = [
    {
        value: 'default',
        label: 'Default',
        description: 'Balanced spacing for most screens.'
    },
    {
        value: 'compact',
        label: 'Compact',
        description: 'Tighter rows that fit more on screen.'
    },
    {
        value: 'detailed',
        label: 'Detailed',
        description: 'Extra metadata under each row.'
    }
];

function itemCode(option: (typeof radioGroupOptions)[number], descriptions: boolean) {
    if (!descriptions) {
        return `    <RadioGroup.Item value="${option.value}" label="${option.label}" />`;
    }

    return `    <RadioGroup.Item
        value="${option.value}"
        label="${option.label}"
        description="${option.description}"
    />`;
}

export function radioGroupCode(settings: RadioGroupSettings) {
    const rootProps = ['bind:value', 'name="option"'];

    if (settings.disabled) {
        rootProps.push('disabled');
    }

    const items = radioGroupOptions
        .map((option) => {
            return itemCode(option, settings.descriptions);
        })
        .join('\n');

    return `<script lang="ts">
    import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';

    let value = $state<string | undefined>('default');
</script>

<RadioGroup.Root ${rootProps.join(' ')}>
${items}
</RadioGroup.Root>
`;
}

export function changedRadioGroupProps(settings: RadioGroupSettings) {
    const keys = Object.keys(radioGroupDefaults) as (keyof RadioGroupSettings)[];

    return keys.filter((key) => {
        return settings[key] !== radioGroupDefaults[key];
    }).length;
}
