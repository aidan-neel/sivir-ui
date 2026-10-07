import type { ButtonVariant } from '@sivir-ui/svelte/components/button';

export type SelectSize = 'sm' | 'md' | 'lg';

export type SelectSettings = {
    variant: ButtonVariant;
    size: SelectSize;
    disabled: boolean;
};

export const selectDefaults: SelectSettings = {
    variant: 'outline',
    size: 'md',
    disabled: false
};

function triggerProps(settings: SelectSettings) {
    const props = ['class="min-w-[220px]"'];

    if (settings.variant !== selectDefaults.variant) {
        props.push(`variant="${settings.variant}"`);
    }
    if (settings.size !== selectDefaults.size) {
        props.push(`size="${settings.size}"`);
    }
    if (settings.disabled) {
        props.push('disabled');
    }
    return props.join(' ');
}

export function selectCode(settings: SelectSettings) {
    return `<script lang="ts">
    import * as Select from '@sivir-ui/svelte/components/select';

    const priorities = [
        { value: 'none', label: 'No priority' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
    ];

    let selectedPriority = $state('medium');

    const selected = $derived(
        priorities.find((priority) => {
            return priority.value === selectedPriority;
        })
    );
</script>

<div class="flex flex-col gap-2">
    <span class="text-sm [font-weight:var(--font-weight-label,500)] text-foreground">Priority</span>
    <Select.Root bind:value={selectedPriority}>
        <Select.Trigger ${triggerProps(settings)}>
            {selected?.label ?? 'Select priority'}
        </Select.Trigger>
        <Select.Content>
            {#each priorities as priority (priority.value)}
                <Select.Item value={priority.value}>
                    {priority.label}
                </Select.Item>
            {/each}
        </Select.Content>
    </Select.Root>
</div>
`;
}

export function changedSelectProps(settings: SelectSettings) {
    const keys: (keyof SelectSettings)[] = ['size', 'disabled'];

    return keys.filter((key) => {
        return settings[key] !== selectDefaults[key];
    }).length;
}
