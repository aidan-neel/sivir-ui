<script lang="ts">
    import * as Gauge from '@sivir-ui/svelte/components/gauge';
    import type { GaugeSettings } from './playground';

    let {
        settings
    }: {
        settings: GaugeSettings;
    } = $props();
</script>

<Gauge.Root
    value={Number(settings.value)}
    label="Context used"
    tone={settings.tone}
    size={settings.size}
/>
