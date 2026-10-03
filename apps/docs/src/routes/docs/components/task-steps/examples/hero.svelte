<script lang="ts">
    import { type TaskStep, TaskSteps } from '@sivir-ui/svelte/components/task-steps';

    const steps: TaskStep[] = [
        { id: 'queue', label: 'Queued', meta: '0.2s' },
        { id: 'build', label: 'Building', meta: '8.1s' },
        { id: 'checks', label: 'Running checks', meta: '3.4s' },
        { id: 'deploy', label: 'Deploying', meta: '5.0s' }
    ];
</script>

<div class="w-full max-w-sm">
    <TaskSteps {steps} current={2} label="Deploy progress" />
</div>
