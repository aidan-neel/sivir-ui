<script lang="ts">
    import { Slider } from '@sivir-ui/svelte/components/slider';

    function formatPercent(value: number) {
        return `${value}%`;
    }
</script>

<div class="w-full max-w-xs">
    <Slider value={40} disabled label="Grain" format={formatPercent} />
</div>
