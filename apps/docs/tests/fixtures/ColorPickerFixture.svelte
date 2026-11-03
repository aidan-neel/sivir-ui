<script lang="ts">
    import type { ColorFormat, ColorOption } from '@sivir-ui/svelte/components/color-picker';
    import ColorPicker from '#lib/components/color-picker.svelte';

    const defaultOptions: ColorOption[] = [
        { label: 'Red', value: '#ff0000' },
        { label: 'Green', value: '#00ff00' },
        { label: 'Blue', value: '#0000ff' }
    ];

    let {
        value = $bindable('#ff0000'),
        label = 'Color',
        format = 'hsl',
        options = defaultOptions,
        onValueChange = (v: string) => {
            value = v;
        }
    }: {
        value?: string;
        label?: string;
        format?: ColorFormat;
        options?: ColorOption[];
        onValueChange?: (value: string) => void;
    } = $props();
</script>

<div style="padding: 40px;">
    <ColorPicker {value} {label} {onValueChange} {options} {format} />
</div>
