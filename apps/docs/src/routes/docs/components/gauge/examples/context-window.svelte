<script lang="ts">
    import * as Gauge from '@sivir-ui/svelte/components/gauge';
</script>

<div class="flex items-center gap-2 text-sm text-foreground-muted">
    <Gauge.Root value={38} size="sm" label="Context used" />
    <span class="tabular-nums">38% of context used</span>
</div>
