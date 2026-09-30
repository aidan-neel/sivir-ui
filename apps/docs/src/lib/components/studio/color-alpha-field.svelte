<script lang="ts">
    import * as Slider from '@sivir-ui/svelte/components/slider';
    import { cn } from '@sivir-ui/svelte/utils';
    import ColorField from './color-field.svelte';

    type ColorAlphaFieldProps = {
        label: string;
        hex: string;
        alpha: number;
        onChange: (hex: string, alpha: number) => void;
        changed?: boolean;
        class?: string;
    };

    let {
        label,
        hex,
        alpha,
        onChange,
        changed = false,
        class: className
    }: ColorAlphaFieldProps = $props();

    const percent = $derived(Math.round(alpha * 100));

    function formatPercent(value: number) {
        return `${value}%`;
    }

    function changeColor(next: string) {
        onChange(next, alpha);
    }

    function changeAlpha(next: number) {
        onChange(hex, next / 100);
    }
</script>

<div
    class={cn('grid min-w-0 grid-cols-[minmax(0,1fr)_5.5rem] gap-1.5', className)}
    role="group"
    aria-label={label}
>
    <ColorField {label} value={hex} onChange={changeColor} {changed} />
    <Slider.Root
        editable
        value={percent}
        min={0}
        max={100}
        step={1}
        label={`${label} opacity`}
        format={formatPercent}
        onValueChange={changeAlpha}
        class="min-h-[34px] justify-end text-[13px]"
    >
        <Slider.Range />
        <Slider.Thumb />
        <Slider.Value class="text-xs" />
    </Slider.Root>
</div>
