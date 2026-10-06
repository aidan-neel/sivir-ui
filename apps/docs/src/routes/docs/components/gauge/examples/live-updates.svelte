<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Gauge from '@sivir-ui/svelte/components/gauge';

    const LIMIT = 200_000;
    const STEP = 34_000;

    let used = $state(46_000);

    const tone = $derived.by<Gauge.GaugeTone>(() => {
        const ratio = used / LIMIT;

        if (ratio >= 0.95) {
            return 'error';
        }

        if (ratio >= 0.8) {
            return 'warning';
        }

        return 'primary';
    });

    function send() {
        used = Math.min(used + STEP, LIMIT);
    }

    function reset() {
        used = 46_000;
    }
</script>

<div class="flex flex-col items-center gap-5">
    <div class="flex items-center gap-4">
        <Gauge.Root value={used} max={LIMIT} {tone} size="lg" label="Context used">
            <Gauge.Track />
            <Gauge.Indicator />
            <Gauge.Value>
                {#snippet children({ percent })}
                    {percent}%
                {/snippet}
            </Gauge.Value>
        </Gauge.Root>
        <div class="flex flex-col gap-0.5 text-sm">
            <span class="font-medium text-foreground">Context window</span>
            <span class="text-foreground-muted tabular-nums">
                {used.toLocaleString('en-US')}
                of {LIMIT.toLocaleString('en-US')} tokens
            </span>
        </div>
    </div>
    <div class="flex gap-2">
        <Button size="sm" onclick={send} disabled={used >= LIMIT}>Send message</Button>
        <Button size="sm" variant="outline" onclick={reset}>Reset</Button>
    </div>
</div>
