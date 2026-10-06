<script lang="ts">
    import Download from '@lucide/svelte/icons/download';
    import { Progress } from '@sivir-ui/svelte/components/progress';
</script>

<div class="flex w-full max-w-md flex-col gap-3">
    <div class="flex items-center gap-3">
        <Download size={16} class="shrink-0 text-foreground-muted" />
        <div class="flex min-w-0 flex-1 flex-col">
            <p class="m-0 truncate text-sm">report-2024.pdf</p>
            <p class="m-0 text-xs text-foreground-muted">2.1 MB of 4.8 MB</p>
        </div>
    </div>
    <Progress value={43} />
</div>
