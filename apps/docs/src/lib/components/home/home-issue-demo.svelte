<script lang="ts">
    import * as Combobox from '@sivir-ui/svelte/components/combobox';
    import * as Select from '@sivir-ui/svelte/components/select';
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import * as TagInput from '@sivir-ui/svelte/components/tag-input';

    type Option = {
        value: string;
        label: string;
    };

    const statuses: Option[] = [
        {
            value: 'backlog',
            label: 'Backlog'
        },
        {
            value: 'todo',
            label: 'Todo'
        },
        {
            value: 'in-progress',
            label: 'In progress'
        },
        {
            value: 'in-review',
            label: 'In review'
        },
        {
            value: 'done',
            label: 'Done'
        }
    ];

    const priorities: Option[] = [
        {
            value: 'urgent',
            label: 'Urgent'
        },
        {
            value: 'high',
            label: 'High'
        },
        {
            value: 'medium',
            label: 'Medium'
        },
        {
            value: 'low',
            label: 'Low'
        }
    ];

    const people: Option[] = [
        {
            value: 'maya',
            label: 'Maya Reyes'
        },
        {
            value: 'daniel',
            label: 'Daniel Kim'
        },
        {
            value: 'emma',
            label: 'Emma Collins'
        },
        {
            value: 'olivia',
            label: 'Olivia Bennett'
        }
    ];

    const rowClass = 'flex min-h-[var(--size-control-md)] items-center justify-between gap-4';
    const labelClass = '[font-size:var(--font-size-body)] text-foreground-muted';

    let status = $state('in-progress');
    let priority = $state('high');
    let assignee = $state<string | undefined>();
    let labels = $state(['checkout', 'safari']);
    let notify = $state(true);

    const statusLabel = $derived(labelFor(statuses, status));
    const priorityLabel = $derived(labelFor(priorities, priority));

    function labelFor(options: Option[], value: string) {
        const match = options.find((option) => {
            return option.value === value;
        });

        return match?.label ?? value;
    }
</script>

<section
    aria-labelledby="home-issue-title"
    class="flex w-full max-w-sm flex-col gap-5 rounded-[var(--radius-xl)] bg-card p-5 shadow-[inset_0_0_0_var(--border-size)_var(--color-border)]"
>
    <div class="flex flex-col gap-1.5">
        <h3
            id="home-issue-title"
            class="m-0 [font-size:var(--font-size-header)] [font-weight:var(--font-weight-header)] text-foreground"
        >
            Checkout stalls on Safari 17
        </h3>
        <p class="m-0 [font-size:var(--font-size-body)] text-foreground-muted text-pretty">
            Tapping Pay leaves the spinner running after the card is approved.
        </p>
    </div>

    <div class="flex flex-col gap-2">
        <div class={rowClass}>
            <span class={labelClass}>Status</span>
            <Select.Root bind:value={status}>
                <Select.Trigger variant="ghost" class="w-auto gap-1.5 px-2.5" aria-label="Status">
                    {statusLabel}
                </Select.Trigger>
                <Select.Content dynamic>
                    {#each statuses as option (option.value)}
                        <Select.Item value={option.value}>{option.label}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>

        <div class={rowClass}>
            <span class={labelClass}>Assignee</span>
            <div class="w-48">
                <Combobox.Root bind:value={assignee}>
                    <Combobox.Trigger placeholder="Assign someone" class="w-full" />
                    <Combobox.Content>
                        <Combobox.Results>
                            {#each people as person (person.value)}
                                <Combobox.Item value={person.value} label={person.label} />
                            {/each}
                        </Combobox.Results>
                    </Combobox.Content>
                </Combobox.Root>
            </div>
        </div>

        <div class={rowClass}>
            <span class={labelClass}>Priority</span>
            <Select.Root bind:value={priority}>
                <Select.Trigger variant="ghost" class="w-auto gap-1.5 px-2.5" aria-label="Priority">
                    {priorityLabel}
                </Select.Trigger>
                <Select.Content dynamic>
                    {#each priorities as option (option.value)}
                        <Select.Item value={option.value}>{option.label}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>
    </div>

    <TagInput.Root bind:tags={labels} label="Labels">
        <TagInput.List />
        <TagInput.Input placeholder="Add a label" />
    </TagInput.Root>

    <Switch
        bind:checked={notify}
        label="Notify watchers"
        description="3 people follow this issue."
    />
</section>
