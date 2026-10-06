<script lang="ts">
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import { spinnerStatus } from '../playground/playground';

    let {
        size = 16,
        speed = 1,
        curved = false,
        ready = false
    }: {
        size?: number;
        speed?: number;
        curved?: boolean;
        ready?: boolean;
    } = $props();
</script>

<div class="flex items-center gap-3 text-sm text-foreground-muted">
    <Spinner {size} {speed} {curved} {ready} aria-hidden="true" />
    <span>{spinnerStatus(ready)}</span>
</div>
