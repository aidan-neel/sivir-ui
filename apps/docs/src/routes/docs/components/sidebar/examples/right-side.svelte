<script lang="ts">
    import History from '@lucide/svelte/icons/history';
    import Info from '@lucide/svelte/icons/info';
    import MessageSquare from '@lucide/svelte/icons/message-square';
    import * as Sidebar from '@sivir-ui/svelte/components/sidebar';

    const panels = [
        { label: 'Details', icon: Info },
        { label: 'Comments', icon: MessageSquare },
        { label: 'History', icon: History }
    ];
    let active = $state('Details');
</script>

<Sidebar.Root class="h-80 rounded-[var(--radius-xl)] border border-border">
    <Sidebar.Inset>
        <header
            class="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border px-3"
        >
            <span class="[font-weight:var(--font-weight-header)]">Q3 planning</span>
            <Sidebar.Trigger aria-label="Toggle details" />
        </header>
    </Sidebar.Inset>
    <Sidebar.Panel side="right" aria-label="Document details">
        <Sidebar.Content>
            <Sidebar.Menu class="p-2">
                {#each panels as panel (panel.label)}
                    <Sidebar.Item>
                        <Sidebar.ItemButton
                            active={active === panel.label}
                            onclick={() => (active = panel.label)}
                        >
                            <panel.icon aria-hidden="true" />
                            <Sidebar.ItemLabel>{panel.label}</Sidebar.ItemLabel>
                        </Sidebar.ItemButton>
                    </Sidebar.Item>
                {/each}
            </Sidebar.Menu>
        </Sidebar.Content>
    </Sidebar.Panel>
</Sidebar.Root>
