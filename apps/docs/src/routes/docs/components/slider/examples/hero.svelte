<script lang="ts">
    import { Slider } from '@sivir-ui/svelte/components/slider';

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
    <Slider bind:value={quality} min={1} max={4} label="Quality" format={formatQuality} />
    <Slider bind:value={strength} label="Strength" format={formatPercent} />
    <Slider bind:value={opacity} label="Opacity" format={formatPercent} />
</div>
