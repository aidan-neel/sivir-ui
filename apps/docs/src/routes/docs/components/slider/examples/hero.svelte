<script lang="ts">
    import { Slider } from '@sivir-ui/svelte/components/slider';

    let {
        step = 1,
        disabled = false
    }: {
        step?: number;
        disabled?: boolean;
    } = $props();

    let quality = $state(2);
    let strength = $state(100);
    let opacity = $state(72);

    function formatQuality(value: number) {
        return `${value}k`;
    }

    function formatPercent(value: number) {
        return `${value}%`;
    }
</script>

<div class="flex w-full max-w-xs flex-col gap-3">
    <Slider
        bind:value={quality}
        min={1}
        max={4}
        label="Quality"
        format={formatQuality}
        {disabled}
    />
    <Slider
        bind:value={strength}
        {step}
        label="Strength"
        format={formatPercent}
        editable
        {disabled}
    />
    <Slider bind:value={opacity} {step} label="Opacity" format={formatPercent} {disabled} />
</div>
