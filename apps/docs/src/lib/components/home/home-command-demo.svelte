<script lang="ts">
    import Archive from '@lucide/svelte/icons/archive';
    import Copy from '@lucide/svelte/icons/copy';
    import Download from '@lucide/svelte/icons/download';
    import PenLine from '@lucide/svelte/icons/pen-line';
    import Search from '@lucide/svelte/icons/search';
    import Share2 from '@lucide/svelte/icons/share-2';
    import * as Command from '@sivir-ui/svelte/components/command';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import type { Component } from 'svelte';

    type Action = {
        name: string;
        icon: Component;
        shortcut: string;
    };

    type ActionGroup = {
        heading: string;
        actions: Action[];
    };

    const groups: ActionGroup[] = [
        {
            heading: 'Project',
            actions: [
                {
                    name: 'Rename project',
                    icon: PenLine,
                    shortcut: 'R'
                },
                {
                    name: 'Duplicate project',
                    icon: Copy,
                    shortcut: 'D'
                }
            ]
        },
        {
            heading: 'Workspace',
            actions: [
                {
                    name: 'Share with the team',
                    icon: Share2,
                    shortcut: 'S'
                },
                {
                    name: 'Download brief',
                    icon: Download,
                    shortcut: 'E'
                },
                {
                    name: 'Archive project',
                    icon: Archive,
                    shortcut: 'A'
                }
            ]
        }
    ];

    let lastAction = $state<string>();
</script>

<div class="flex w-full max-w-xs flex-col items-center gap-3">
    <Command.Root>
        <Command.Trigger
            variant="outline"
            class="w-full justify-between gap-2 px-3 text-foreground-muted"
        >
            <span class="flex min-w-0 items-center gap-2">
                <Search size={15} aria-hidden="true" />
                <span class="truncate">Search Q3 launch plan</span>
            </span>
            <Shortcut shortcut="cmd+K" class="shrink-0" />
        </Command.Trigger>
        <Command.Content>
            <Command.Search placeholder="Type a command…" />
            <Command.Results>
                {#each groups as group, index (group.heading)}
                    {#if index > 0}
                        <Command.Separator />
                    {/if}
                    <Command.Group heading={group.heading}>
                        {#each group.actions as action (action.name)}
                            {@const Icon = action.icon}
                            <Command.Item
                                name={action.name}
                                callback={() => {
                                    lastAction = action.name;
                                }}
                            >
                                <Icon size={16} aria-hidden="true" />
                                <span class="flex-1">{action.name}</span>
                                <Shortcut shortcut={action.shortcut} />
                            </Command.Item>
                        {/each}
                    </Command.Group>
                {/each}
            </Command.Results>
            <Command.Footer class="max-sm:hidden">
                <span class="flex items-center gap-1.5">
                    <Shortcut shortcut="up" />
                    <Shortcut shortcut="down" />
                    navigate
                </span>
                <span class="flex items-center gap-1.5">
                    <Shortcut shortcut="enter" />
                    run
                </span>
                <span class="ml-auto flex items-center gap-1.5">
                    <Shortcut shortcut="esc" />
                    close
                </span>
            </Command.Footer>
        </Command.Content>
    </Command.Root>
    <p
        aria-live="polite"
        class="m-0 min-h-[1lh] [font-size:var(--font-size-label)] text-foreground-muted"
    >
        {lastAction ? `Ran “${lastAction}”` : 'Open the palette and pick a command.'}
    </p>
</div>
