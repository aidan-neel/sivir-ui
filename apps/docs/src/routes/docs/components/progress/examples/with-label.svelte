<script lang="ts">
    import Zap from '@lucide/svelte/icons/zap';
    import { Progress } from '@sivir-ui/svelte/components/progress';
</script>

<div class="flex w-full max-w-md flex-col gap-3">
    <div class="flex items-center gap-2">
        <Zap size={16} class="shrink-0 text-yellow-600 dark:text-yellow-500" />
        <p class="m-0 flex-1 text-sm">Deploying to production</p>
        <span class="text-sm text-foreground-muted">58%</span>
    </div>
    <Progress value={58} />
</div>
