<script lang="ts">
    import ChartLine from '@lucide/svelte/icons/chart-line';
    import FolderKanban from '@lucide/svelte/icons/folder-kanban';
    import House from '@lucide/svelte/icons/house';
    import Settings from '@lucide/svelte/icons/settings';
    import * as Sidebar from '@sivir-ui/svelte/components/sidebar';

    const items = [
        { label: 'Overview', icon: House },
        { label: 'Projects', icon: FolderKanban },
        { label: 'Analytics', icon: ChartLine },
        { label: 'Settings', icon: Settings }
    ];
    let active = $state('Overview');
</script>

<Sidebar.Root class="h-96 rounded-[var(--radius-xl)] border border-border">
    <Sidebar.Panel>
        <Sidebar.Header>
            <span class="px-2 pt-1 [font-weight:var(--font-weight-header)]">Acme</span>
        </Sidebar.Header>
        <Sidebar.Content>
            <Sidebar.Group>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        {#each items as item (item.label)}
                            <Sidebar.Item>
                                <Sidebar.ItemButton
                                    active={active === item.label}
                                    onclick={() => (active = item.label)}
                                >
                                    <item.icon aria-hidden="true" />
                                    <Sidebar.ItemLabel>{item.label}</Sidebar.ItemLabel>
                                </Sidebar.ItemButton>
                            </Sidebar.Item>
                        {/each}
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        </Sidebar.Content>
    </Sidebar.Panel>
    <Sidebar.Inset>
        <header class="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
            <Sidebar.Trigger />
            <span class="[font-weight:var(--font-weight-header)]">{active}</span>
        </header>
    </Sidebar.Inset>
</Sidebar.Root>
