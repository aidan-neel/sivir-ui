export type CheckboxVariant = 'default' | 'primary';

export type CheckboxSettings = {
    variant: CheckboxVariant;
    checked: boolean;
    description: boolean;
    disabled: boolean;
};

export const checkboxDefaults: CheckboxSettings = {
    variant: 'default',
    checked: false,
    description: false,
    disabled: false
};

export const checkboxVariants: {
    value: CheckboxVariant;
    label: string;
}[] = [
    {
        value: 'default',
        label: 'Default'
    },
    {
        value: 'primary',
        label: 'Primary'
    }
];

function checkboxProps(settings: CheckboxSettings) {
    const props: string[] = [];

    if (settings.variant !== 'default') {
        props.push(`variant="${settings.variant}"`);
    }
    if (settings.checked) {
        props.push('checked');
    }
    props.push('label="Accept terms of service"');

    if (settings.description) {
        props.push('description="Required to create an account."');
    }
    if (settings.disabled) {
        props.push('disabled');
    }

    return props;
}

function checkboxMarkup(settings: CheckboxSettings) {
    const props = checkboxProps(settings);

    if (props.length === 1) {
        return `<Checkbox ${props[0]} />`;
    }

    const lines = props.map((prop) => {
        return `    ${prop}`;
    });

    return `<Checkbox
${lines.join('\n')}
/>`;
}

export function checkboxCode(settings: CheckboxSettings) {
    return `<script lang="ts">
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';
</script>

${checkboxMarkup(settings)}
`;
}

export function changedCheckboxProps(settings: CheckboxSettings) {
    const changes = [
        settings.checked !== checkboxDefaults.checked,
        settings.description !== checkboxDefaults.description,
        settings.disabled !== checkboxDefaults.disabled
    ];

    return changes.filter(Boolean).length;
}
