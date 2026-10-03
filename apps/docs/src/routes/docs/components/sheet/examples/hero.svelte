<script lang="ts">
    import Circle from '@lucide/svelte/icons/circle';
    import CircleAlert from '@lucide/svelte/icons/circle-alert';
    import CircleCheck from '@lucide/svelte/icons/circle-check';
    import CircleDot from '@lucide/svelte/icons/circle-dot';
    import Minus from '@lucide/svelte/icons/minus';
    import SignalHigh from '@lucide/svelte/icons/signal-high';
    import SignalLow from '@lucide/svelte/icons/signal-low';
    import SignalMedium from '@lucide/svelte/icons/signal-medium';
    import SquarePen from '@lucide/svelte/icons/square-pen';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Input } from '@sivir-ui/svelte/components/input';
    import { Label } from '@sivir-ui/svelte/components/label';
    import * as Select from '@sivir-ui/svelte/components/select';
    import * as Sheet from '@sivir-ui/svelte/components/sheet';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import { Textarea } from '@sivir-ui/svelte/components/textarea';

    let open = $state(false);
    let title = $state('');
    let description = $state('');
    let status = $state('todo');
    let priority = $state('none');
    let assignee = $state('unassigned');

    const statuses = [
        { value: 'todo', label: 'Todo', icon: Circle },
        { value: 'in-progress', label: 'In progress', icon: CircleDot },
        { value: 'done', label: 'Done', icon: CircleCheck }
    ];

    const priorities = [
        { value: 'none', label: 'No priority', icon: Minus },
        { value: 'urgent', label: 'Urgent', icon: CircleAlert },
        { value: 'high', label: 'High', icon: SignalHigh },
        { value: 'medium', label: 'Medium', icon: SignalMedium },
        { value: 'low', label: 'Low', icon: SignalLow }
    ];

    const assignees = [
        { value: 'unassigned', label: 'Unassigned', initials: '?' },
        { value: 'an', label: 'Aidan N.', initials: 'AN' },
        { value: 'sk', label: 'Sam K.', initials: 'SK' }
    ];

    const statusMeta = $derived(statuses.find((item) => item.value === status));
    const priorityMeta = $derived(priorities.find((item) => item.value === priority));
    const assigneeMeta = $derived(assignees.find((item) => item.value === assignee));
    const canCreate = $derived(title.trim().length > 0);

    function reset() {
        title = '';
        description = '';
        status = 'todo';
        priority = 'none';
        assignee = 'unassigned';
    }

    function close() {
        reset();
        open = false;
    }

    function createIssue() {
        if (canCreate) {
            close();
        }
    }
</script>

<Sheet.Root bind:open>
    <Sheet.Trigger>
        <SquarePen size={14} />
        New issue
    </Sheet.Trigger>
    <Sheet.Content side="right">
        <Sheet.Header>
            <Sheet.Title>New issue</Sheet.Title>
            <Sheet.Description>Create a new issue in Engineering.</Sheet.Description>
        </Sheet.Header>

        <div class="flex flex-col gap-4">
            <Input bind:value={title} label="Title" placeholder="Issue title" />
            <Textarea
                bind:value={description}
                label="Description"
                placeholder="Add a description…"
                class="min-h-28"
            />

            <div class="grid grid-cols-2 gap-3">
                <div class="flex min-w-0 flex-col gap-1.5">
                    <Label>Status</Label>
                    <Select.Root bind:value={status}>
                        <Select.Trigger class="w-full" variant="outline" size="md">
                            <span class="flex min-w-0 items-center gap-2">
                                {#if statusMeta}
                                    <statusMeta.icon
                                        size={14}
                                        class="shrink-0 text-foreground-muted"
                                    />
                                {/if}
                                {statusMeta?.label}
                            </span>
                        </Select.Trigger>
                        <Select.Content>
                            {#each statuses as item (item.value)}
                                <Select.Item value={item.value} label={item.label}>
                                    <span class="flex items-center gap-2">
                                        <item.icon size={14} class="text-foreground-muted" />
                                        {item.label}
                                    </span>
                                </Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Root>
                </div>

                <div class="flex min-w-0 flex-col gap-1.5">
                    <Label>Priority</Label>
                    <Select.Root bind:value={priority}>
                        <Select.Trigger class="w-full" variant="outline" size="md">
                            <span class="flex min-w-0 items-center gap-2">
                                {#if priorityMeta}
                                    <priorityMeta.icon
                                        size={14}
                                        class="shrink-0 text-foreground-muted"
                                    />
                                {/if}
                                {priorityMeta?.label}
                            </span>
                        </Select.Trigger>
                        <Select.Content>
                            {#each priorities as item (item.value)}
                                <Select.Item value={item.value} label={item.label}>
                                    <span class="flex items-center gap-2">
                                        <item.icon size={14} class="text-foreground-muted" />
                                        {item.label}
                                    </span>
                                </Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Root>
                </div>
            </div>

            <div class="flex flex-col gap-1.5">
                <Label>Assignee</Label>
                <Select.Root bind:value={assignee}>
                    <Select.Trigger class="w-full" variant="outline" size="md">
                        <span class="flex min-w-0 items-center gap-2">
                            {#if assigneeMeta}
                                <Avatar.Root size="sm" class="size-5 shrink-0 text-[10px]">
                                    <Avatar.Fallback>{assigneeMeta.initials}</Avatar.Fallback>
                                </Avatar.Root>
                            {/if}
                            {assigneeMeta?.label}
                        </span>
                    </Select.Trigger>
                    <Select.Content>
                        {#each assignees as person (person.value)}
                            <Select.Item value={person.value} label={person.label}>
                                <span class="flex items-center gap-2">
                                    <Avatar.Root size="sm" class="size-5 text-[10px]">
                                        <Avatar.Fallback>{person.initials}</Avatar.Fallback>
                                    </Avatar.Root>
                                    {person.label}
                                </span>
                            </Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </div>
        </div>

        <Sheet.Footer>
            <Sheet.Close onclick={close}>
                Cancel
                <Shortcut shortcut="esc" />
            </Sheet.Close>
            <Button onclick={createIssue}>
                Create issue
                <Shortcut shortcut="enter" />
            </Button>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>
