import type { InputProps } from '@sivir-ui/svelte/components/input';

export type InputVariant = NonNullable<InputProps['variant']>;

export type InputSettings = {
    variant: InputVariant;
    label: boolean;
    description: boolean;
    leading: boolean;
    disabled: boolean;
};

export const inputDefaults: InputSettings = {
    variant: 'outline',
    label: true,
    description: false,
    leading: false,
    disabled: false
};

export const INPUT_LABEL = 'Email';

export const INPUT_DESCRIPTION = 'We only use this to send receipts.';

export const INPUT_PLACEHOLDER = 'you@example.com';

function inputProps(settings: InputSettings) {
    const props = ['bind:value={email}'];

    if (settings.variant !== inputDefaults.variant) {
        props.push(`variant="${settings.variant}"`);
    }
    if (settings.label) {
        props.push(`label="${INPUT_LABEL}"`);
    } else {
        props.push(`aria-label="${INPUT_LABEL}"`);
    }
    if (settings.description) {
        props.push(`description="${INPUT_DESCRIPTION}"`);
    }
    props.push(`placeholder="${INPUT_PLACEHOLDER}"`);

    if (settings.disabled) {
        props.push('disabled');
    }
    return props;
}

function inputTag(settings: InputSettings) {
    const props = inputProps(settings);
    const inline = `<Input ${props.join(' ')}`;

    if (!settings.leading && inline.length <= 78) {
        return `${inline} />`;
    }

    const stacked = props
        .map((prop) => {
            return `    ${prop}`;
        })
        .join('\n');

    if (!settings.leading) {
        return `<Input\n${stacked}\n/>`;
    }
    return `<Input\n${stacked}\n>\n    {#snippet leading()}\n        <Mail />\n    {/snippet}\n</Input>`;
}

export function inputCode(settings: InputSettings) {
    const imports = settings.leading
        ? [
              "    import Mail from '@lucide/svelte/icons/mail';",
              "    import { Input } from '@sivir-ui/svelte/components/input';"
          ]
        : ["    import { Input } from '@sivir-ui/svelte/components/input';"];

    return `<script lang="ts">
${imports.join('\n')}

    let email = $state('');
</script>

${inputTag(settings)}
`;
}

export function changedInputProps(settings: InputSettings) {
    const keys: (keyof InputSettings)[] = ['label', 'description', 'leading', 'disabled'];

    return keys.filter((key) => {
        return settings[key] !== inputDefaults[key];
    }).length;
}
