export type ComboboxVariant = 'outline' | 'secondary';

export type ComboboxSize = 'sm' | 'md' | 'lg';

export type ComboboxAppearance = 'button' | 'input';

export type ComboboxSearchPlacement = 'trigger' | 'menu';

export type ComboboxSettings = {
    variant: ComboboxVariant;
    size: ComboboxSize;
    appearance: ComboboxAppearance;
    searchPlacement: ComboboxSearchPlacement;
    disabled: boolean;
};

export const comboboxDefaults: ComboboxSettings = {
    variant: 'outline',
    size: 'md',
    appearance: 'button',
    searchPlacement: 'trigger',
    disabled: false
};

const LINE_WIDTH = 100;

function triggerProps(settings: ComboboxSettings) {
    const props: string[] = [];

    if (settings.variant !== comboboxDefaults.variant) {
        props.push(`variant="${settings.variant}"`);
    }
    if (settings.size !== comboboxDefaults.size) {
        props.push(`size="${settings.size}"`);
    }
    if (settings.appearance !== comboboxDefaults.appearance) {
        props.push(`appearance="${settings.appearance}"`);
    }
    if (settings.searchPlacement !== comboboxDefaults.searchPlacement) {
        props.push(`searchPlacement="${settings.searchPlacement}"`);
    }
    if (settings.disabled) {
        props.push('disabled');
    }
    props.push('placeholder="Select an option"', 'class="w-full"');

    return props;
}

function triggerTag(settings: ComboboxSettings) {
    const indent = '        ';
    const props = triggerProps(settings);
    const inline = `${indent}<Combobox.Trigger ${props.join(' ')} />`;

    if (inline.length <= LINE_WIDTH) {
        return inline;
    }

    const stacked = props
        .map((prop) => {
            return `${indent}    ${prop}`;
        })
        .join('\n');

    return `${indent}<Combobox.Trigger\n${stacked}\n${indent}/>`;
}

export function comboboxCode(settings: ComboboxSettings) {
    return `<script lang="ts">
    import * as Combobox from '@sivir-ui/svelte/components/combobox';

    const items = [
        { value: 'option-1', label: 'Option 1' },
        { value: 'option-2', label: 'Option 2' },
        { value: 'option-3', label: 'Option 3' }
    ];
</script>

<div class="w-[280px]">
    <Combobox.Root>
${triggerTag(settings)}
        <Combobox.Content>
            <Combobox.Results>
                {#each items as item (item.value)}
                    <Combobox.Item value={item.value} label={item.label} callback={() => {}} />
                {/each}
            </Combobox.Results>
        </Combobox.Content>
    </Combobox.Root>
</div>
`;
}

export function changedComboboxProps(settings: ComboboxSettings) {
    const keys: (keyof ComboboxSettings)[] = ['size', 'appearance', 'searchPlacement', 'disabled'];

    return keys.filter((key) => {
        return settings[key] !== comboboxDefaults[key];
    }).length;
}
