<script lang="ts">
    import ChartLine from '@lucide/svelte/icons/chart-line';
    import FolderKanban from '@lucide/svelte/icons/folder-kanban';
    import House from '@lucide/svelte/icons/house';
    import Inbox from '@lucide/svelte/icons/inbox';
    import Settings from '@lucide/svelte/icons/settings';
    import * as Sidebar from '@sivir-ui/svelte/components/sidebar';

    type RailItem = {
        label: string;
        icon: typeof House;
        count?: number;
    };

    const items: RailItem[] = [
        { label: 'Home', icon: House },
        { label: 'Inbox', icon: Inbox, count: 12 },
        { label: 'Projects', icon: FolderKanban },
        { label: 'Analytics', icon: ChartLine }
    ];
    let open = $state(false);
    let active = $state('Home');
</script>

<Sidebar.Root
    bind:open
    collapsible="icon"
    variant="inset"
    class="h-96 rounded-[var(--radius-xl)] border border-border"
>
    <Sidebar.Panel>
        <Sidebar.Content>
            <Sidebar.Group>
                <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        {#each items as item (item.label)}
                            <Sidebar.Item>
                                <Sidebar.ItemButton
                                    active={active === item.label}
                                    tooltip={item.label}
                                    onclick={() => (active = item.label)}
                                >
                                    <item.icon aria-hidden="true" />
                                    <Sidebar.ItemLabel>{item.label}</Sidebar.ItemLabel>
                                </Sidebar.ItemButton>
                                {#if item.count}
                                    <Sidebar.ItemBadge>{item.count}</Sidebar.ItemBadge>
                                {/if}
                            </Sidebar.Item>
                        {/each}
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
            <Sidebar.Menu>
                <Sidebar.Item>
                    <Sidebar.ItemButton tooltip="Settings">
                        <Settings aria-hidden="true" />
                        <Sidebar.ItemLabel>Settings</Sidebar.ItemLabel>
                    </Sidebar.ItemButton>
                </Sidebar.Item>
            </Sidebar.Menu>
        </Sidebar.Footer>
    </Sidebar.Panel>
    <Sidebar.Inset>
        <header class="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
            <Sidebar.Trigger />
            <span class="[font-weight:var(--font-weight-header)]">{active}</span>
        </header>
    </Sidebar.Inset>
</Sidebar.Root>
