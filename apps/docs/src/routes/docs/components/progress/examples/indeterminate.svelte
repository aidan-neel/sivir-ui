<script lang="ts">
    import Loader from '@lucide/svelte/icons/loader';
    import { Progress } from '@sivir-ui/svelte/components/progress';
</script>

<div class="flex w-full max-w-md flex-col gap-3">
    <div class="flex items-center gap-2">
        <Loader size={16} class="animate-spin text-foreground-muted" />
        <p class="m-0 text-sm">Querying data warehouse…</p>
    </div>
    <Progress indeterminate />
</div>
