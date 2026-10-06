<script lang="ts">
    import * as Gauge from '@sivir-ui/svelte/components/gauge';
</script>

<div class="flex items-center justify-center gap-6">
    <Gauge.Root value={64} size="sm" label="Small gauge" />
    <Gauge.Root value={64} size="md" label="Medium gauge" />
    <Gauge.Root value={64} size="lg" label="Large gauge" />
</div>
