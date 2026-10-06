<script lang="ts">
    import type { ColorFormat, ColorOption } from '@sivir-ui/svelte/components/color-picker';
    import * as ColorPicker from '@sivir-ui/svelte/components/color-picker';

    let {
        color = $bindable('#5e6ad2'),
        variant = 'outline',
        format = 'hsl',
        label = false,
        presets = false
    }: {
        color?: string;
        variant?: 'outline' | 'secondary' | 'ghost';
        format?: ColorFormat;
        label?: boolean;
        presets?: boolean;
    } = $props();

    const swatches: ColorOption[] = [
        { label: 'Indigo', value: '#5e6ad2' },
        { label: 'Blue', value: '#2563eb' },
        { label: 'Teal', value: '#0d9488' },
        { label: 'Amber', value: '#d97706' },
        { label: 'Rose', value: '#e11d48' }
    ];
</script>

<ColorPicker.Root
    value={color}
    onValueChange={(v) => (color = v)}
    {format}
    label={label ? 'Accent color' : undefined}
    options={presets ? swatches : undefined}
>
    <ColorPicker.Trigger {variant} />
    <ColorPicker.Content />
</ColorPicker.Root>
