import type { TaskStep } from '@sivir-ui/svelte/components/task-steps';

export type TaskStepsCurrent = '0' | '1' | '2' | '3' | '4';

export type TaskStepsSettings = {
    current: TaskStepsCurrent;
    failed: boolean;
};

export const taskStepsDefaults: TaskStepsSettings = {
    current: '2',
    failed: false
};

export const deploySteps: TaskStep[] = [
    {
        id: 'queue',
        label: 'Queued',
        meta: '0.2s'
    },
    {
        id: 'build',
        label: 'Building',
        meta: '8.1s'
    },
    {
        id: 'checks',
        label: 'Running checks',
        meta: '3.4s'
    },
    {
        id: 'deploy',
        label: 'Deploying',
        meta: '5.0s'
    }
];

function stepLines() {
    return deploySteps
        .map((step) => {
            return `        { id: '${step.id}', label: '${step.label}', meta: '${step.meta}' }`;
        })
        .join(',\n');
}

function taskStepsProps(settings: TaskStepsSettings) {
    const props = ['{steps}', `current={${settings.current}}`];

    if (settings.failed) {
        props.push('failed');
    }
    props.push('label="Deploy progress"');
    return props;
}

export function taskStepsCode(settings: TaskStepsSettings) {
    return `<script lang="ts">
    import { type TaskStep, TaskSteps } from '@sivir-ui/svelte/components/task-steps';

    const steps: TaskStep[] = [
${stepLines()}
    ];
</script>

<div class="w-full max-w-sm">
    <TaskSteps ${taskStepsProps(settings).join(' ')} />
</div>
`;
}

export function changedTaskStepsProps(settings: TaskStepsSettings) {
    const keys = Object.keys(taskStepsDefaults) as (keyof TaskStepsSettings)[];

    return keys.filter((key) => {
        return settings[key] !== taskStepsDefaults[key];
    }).length;
}
