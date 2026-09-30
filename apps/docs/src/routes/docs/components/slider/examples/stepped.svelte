<script lang="ts">
    import { Slider } from '@sivir-ui/svelte/components/slider';

    let reminder = $state(3);

    function formatDays(value: number) {
        return value === 1 ? '1 day' : `${value} days`;
    }
</script>

<div class="w-full max-w-xs">
    <Slider bind:value={reminder} min={1} max={14} step={1} label="Reminder" format={formatDays} />
</div>
