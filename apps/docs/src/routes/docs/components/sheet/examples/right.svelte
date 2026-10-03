<script lang="ts">
    import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';
    import { Label } from '@sivir-ui/svelte/components/label';
    import * as Select from '@sivir-ui/svelte/components/select';
    import * as Sheet from '@sivir-ui/svelte/components/sheet';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import * as Typography from '@sivir-ui/svelte/components/typography';

    let open = $state(false);
    let status = $state('all');
    let onlyMine = $state(false);
    let includeArchived = $state(false);
    let hasAssignee = $state(true);
    let hasLabels = $state(true);

    const statuses = [
        { value: 'all', label: 'All statuses' },
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' }
    ];

    const statusLabel = $derived(statuses.find((item) => item.value === status)?.label ?? 'Status');
    const activeCount = $derived(
        (status !== 'all' ? 1 : 0) +
            (onlyMine ? 1 : 0) +
            (includeArchived ? 1 : 0) +
            (!hasAssignee ? 1 : 0) +
            (!hasLabels ? 1 : 0)
    );

    function reset() {
        status = 'all';
        onlyMine = false;
        includeArchived = false;
        hasAssignee = true;
        hasLabels = true;
    }
</script>

<Sheet.Root bind:open>
    <Sheet.Trigger variant="outline">
        <SlidersHorizontal size={14} />
        Filters
        {#if activeCount > 0}
            <Badge variant="secondary">{activeCount}</Badge>
        {/if}
    </Sheet.Trigger>
    <Sheet.Content side="right">
        <Sheet.Header>
            <Sheet.Title>Filters</Sheet.Title>
            <Sheet.Description>Narrow the issue list.</Sheet.Description>
        </Sheet.Header>

        <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-1.5">
                <Label>Status</Label>
                <Select.Root bind:value={status}>
                    <Select.Trigger class="w-full" variant="outline" size="md">
                        {statusLabel}
                    </Select.Trigger>
                    <Select.Content>
                        {#each statuses as item (item.value)}
                            <Select.Item value={item.value}>{item.label}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </div>

            <div class="flex flex-col gap-1">
                <Typography.Metadata class="pb-1">Show</Typography.Metadata>
                <Switch bind:checked={onlyMine} label="Only my issues" />
                <Switch bind:checked={includeArchived} label="Include archived" />
            </div>

            <fieldset class="m-0 flex min-w-0 flex-col gap-1 border-0 p-0">
                <legend class="mb-2 p-0">
                    <Typography.Metadata>Must have</Typography.Metadata>
                </legend>
                <Checkbox bind:checked={hasAssignee} label="Assignee" />
                <Checkbox bind:checked={hasLabels} label="Labels" />
            </fieldset>
        </div>

        <Sheet.Footer>
            <Sheet.Close variant="ghost" onclick={reset}>
                Reset
                <Shortcut shortcut="esc" />
            </Sheet.Close>
            <Button
                onclick={() => {
                    open = false;
                }}
            >
                Apply filters
                {#if activeCount > 0}
                    <Badge variant="secondary">{activeCount}</Badge>
                {/if}
                <Shortcut shortcut="enter" />
            </Button>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>
