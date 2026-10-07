<script lang="ts">
    import * as Gauge from '@sivir-ui/svelte/components/gauge';
</script>

<div class="flex items-center gap-4">
    <Gauge.Root value={72_000} max={100_000} label="Monthly API usage" tone="warning" size="lg">
        <Gauge.Track />
        <Gauge.Indicator />
        <Gauge.Value>
            {#snippet children({ percent })}
                {percent}%
            {/snippet}
        </Gauge.Value>
    </Gauge.Root>
    <div class="flex flex-col gap-0.5 text-sm">
        <span class="font-medium text-foreground">Monthly API usage</span>
        <span class="text-foreground-muted tabular-nums">72,000 of 100,000 requests</span>
    </div>
</div>
