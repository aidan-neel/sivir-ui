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

    const statusLabel = $derived(statuses.find((s) => s.value === status)?.label ?? 'Status');
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

    function apply() {
        open = false;
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

        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
                <Label>Status</Label>
                <Select.Root bind:value={status}>
                    <Select.Trigger class="w-full" variant="outline" size="md"
                        >{statusLabel}</Select.Trigger
                    >
                    <Select.Content>
                        {#each statuses as item (item.value)}
                            <Select.Item value={item.value}>{item.label}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </div>

            <div class="h-px w-full bg-border" role="separator"></div>

            <div class="flex flex-col gap-3">
                <Switch bind:checked={onlyMine} label="Only my issues" />
                <Switch bind:checked={includeArchived} label="Include archived" />
            </div>

            <div class="h-px w-full bg-border" role="separator"></div>

            <fieldset class="flex flex-col gap-3">
                <legend
                    class="pb-3 text-sm [font-weight:var(--font-weight-label,500)] text-foreground"
                >
                    Fields
                </legend>
                <Checkbox bind:checked={hasAssignee} label="Has assignee" />
                <Checkbox bind:checked={hasLabels} label="Has labels" />
            </fieldset>
        </div>

        <Sheet.Footer>
            <Sheet.Close
                variant="ghost"
                onclick={() => {
                    reset();
                    open = false;
                }}
            >
                Reset
                <Shortcut shortcut="esc" />
            </Sheet.Close>
            <Button onclick={() => apply()}>
                Apply filters
                {#if activeCount > 0}
                    <Badge variant="secondary">{activeCount}</Badge>
                {/if}
                <Shortcut shortcut="enter" />
            </Button>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>
