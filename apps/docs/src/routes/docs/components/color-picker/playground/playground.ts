import type { ColorFormat } from '@sivir-ui/svelte/components/color-picker';

export type ColorPickerTriggerVariant = 'outline' | 'secondary' | 'ghost';

export type ColorPickerSettings = {
    variant: ColorPickerTriggerVariant;
    format: ColorFormat;
    label: boolean;
    presets: boolean;
};

export const colorPickerDefaults: ColorPickerSettings = {
    variant: 'outline',
    format: 'hsl',
    label: false,
    presets: false
};

const LINE_WIDTH = 100;

function openingTag(name: string, props: string[], closing = '>') {
    const attributes = props
        .map((prop) => {
            return ` ${prop}`;
        })
        .join('');
    const inline = `<${name}${attributes}${closing}`;

    if (inline.length <= LINE_WIDTH) {
        return inline;
    }

    const stacked = props
        .map((prop) => {
            return `    ${prop}`;
        })
        .join('\n');

    return `<${name}\n${stacked}\n${closing.trim()}`;
}

function scriptLines(settings: ColorPickerSettings) {
    const lines: string[] = [];

    if (settings.presets) {
        lines.push(
            "    import type { ColorOption } from '@sivir-ui/svelte/components/color-picker';"
        );
    }
    lines.push(
        "    import * as ColorPicker from '@sivir-ui/svelte/components/color-picker';",
        '',
        "    let color = $state('#5e6ad2');"
    );

    if (settings.presets) {
        lines.push(
            '',
            '    const swatches: ColorOption[] = [',
            "        { label: 'Indigo', value: '#5e6ad2' },",
            "        { label: 'Blue', value: '#2563eb' },",
            "        { label: 'Teal', value: '#0d9488' },",
            "        { label: 'Amber', value: '#d97706' },",
            "        { label: 'Rose', value: '#e11d48' }",
            '    ];'
        );
    }
    return lines;
}

function rootProps(settings: ColorPickerSettings) {
    const props = ['value={color}', 'onValueChange={(v) => (color = v)}'];

    if (settings.format !== colorPickerDefaults.format) {
        props.push(`format="${settings.format}"`);
    }
    if (settings.label) {
        props.push('label="Accent color"');
    }
    if (settings.presets) {
        props.push('options={swatches}');
    }
    return props;
}

function triggerProps(settings: ColorPickerSettings) {
    if (settings.variant === colorPickerDefaults.variant) {
        return [];
    }
    return [`variant="${settings.variant}"`];
}

export function colorPickerCode(settings: ColorPickerSettings) {
    const root = openingTag('ColorPicker.Root', rootProps(settings));
    const trigger = openingTag('ColorPicker.Trigger', triggerProps(settings), ' />');

    return `<script lang="ts">
${scriptLines(settings).join('\n')}
</script>

${root}
    ${trigger}
    <ColorPicker.Content />
</ColorPicker.Root>
`;
}

export function changedColorPickerProps(settings: ColorPickerSettings) {
    const keys: (keyof ColorPickerSettings)[] = ['format', 'label', 'presets'];

    return keys.filter((key) => {
        return settings[key] !== colorPickerDefaults[key];
    }).length;
}
