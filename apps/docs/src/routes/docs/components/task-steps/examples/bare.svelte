<script lang="ts">
    import { type TaskStep, TaskSteps } from '@sivir-ui/svelte/components/task-steps';

    const steps: TaskStep[] = [
        { id: 'install', label: 'Installing dependencies', meta: '2.3s' },
        { id: 'compile', label: 'Compiling', meta: '1.8s' },
        { id: 'test', label: 'Running tests', meta: '4.2s' },
        { id: 'bundle', label: 'Building bundle', meta: '0s' }
    ];
</script>

<div class="w-full max-w-sm">
    <TaskSteps {steps} current={3} failed label="Build failed" />
</div>
