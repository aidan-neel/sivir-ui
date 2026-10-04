<script lang="ts">
    import Archive from '@lucide/svelte/icons/archive';
    import Ellipsis from '@lucide/svelte/icons/ellipsis';
    import FilePen from '@lucide/svelte/icons/file-pen';
    import Inbox from '@lucide/svelte/icons/inbox';
    import Send from '@lucide/svelte/icons/send';
    import * as Sidebar from '@sivir-ui/svelte/components/sidebar';

    const folders = [
        { label: 'Inbox', icon: Inbox, count: 12 },
        { label: 'Drafts', icon: FilePen, count: 2 },
        { label: 'Sent', icon: Send, count: 0 },
        { label: 'Archive', icon: Archive, count: 0 }
    ];
    let active = $state('Inbox');
</script>

<Sidebar.Root collapsible="none" class="h-80 rounded-[var(--radius-xl)] border border-border">
    <Sidebar.Panel>
        <Sidebar.Content>
            <Sidebar.Group>
                <Sidebar.GroupLabel>Mail</Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        {#each folders as folder (folder.label)}
                            <Sidebar.Item>
                                <Sidebar.ItemButton
                                    active={active === folder.label}
                                    onclick={() => (active = folder.label)}
                                >
                                    <folder.icon aria-hidden="true" />
                                    <Sidebar.ItemLabel>{folder.label}</Sidebar.ItemLabel>
                                </Sidebar.ItemButton>
                                {#if folder.count > 0}
                                    <Sidebar.ItemBadge>{folder.count}</Sidebar.ItemBadge>
                                {/if}
                                <Sidebar.ItemAction aria-label={`${folder.label} options`}>
                                    <Ellipsis aria-hidden="true" />
                                </Sidebar.ItemAction>
                            </Sidebar.Item>
                        {/each}
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        </Sidebar.Content>
    </Sidebar.Panel>
    <Sidebar.Inset>
        <p class="p-5 text-foreground-muted">Hover a folder to reveal its options.</p>
    </Sidebar.Inset>
</Sidebar.Root>
