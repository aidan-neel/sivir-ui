<script lang="ts">
    import * as Slider from '@sivir-ui/svelte/components/slider';

    let exposure = $state(0.4);
    let applied = $state(0.4);

    function formatStops(value: number) {
        const sign = value > 0 ? '+' : '';

        return `${sign}${value.toFixed(1)} EV`;
    }

    function apply(value: number) {
        applied = value;
    }
</script>

<div class="flex w-full max-w-xs flex-col gap-2">
    <Slider.Root
        bind:value={exposure}
        min={-2}
        max={2}
        step={0.1}
        format={formatStops}
        onValueCommit={apply}
    >
        <Slider.Range class="bg-primary/15 group-hover/slider:bg-primary/20" />
        <Slider.Value />
        <Slider.Label>Exposure</Slider.Label>
    </Slider.Root>
    <p class="text-label text-foreground-muted">
        Applied <span class="font-mono text-foreground">{formatStops(applied)}</span>
    </p>
</div>
