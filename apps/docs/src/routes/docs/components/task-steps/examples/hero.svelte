<script lang="ts">
    import { TaskSteps } from '@sivir-ui/svelte/components/task-steps';
    import { deploySteps } from '../playground/playground';

    let {
        current = 2,
        failed = false
    }: {
        current?: number;
        failed?: boolean;
    } = $props();
</script>

<div class="w-full max-w-sm">
    <TaskSteps steps={deploySteps} {current} {failed} label="Deploy progress" />
</div>
