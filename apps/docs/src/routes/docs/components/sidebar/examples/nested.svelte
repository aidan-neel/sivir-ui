<script lang="ts">
    import Bell from '@lucide/svelte/icons/bell';
    import Clock from '@lucide/svelte/icons/clock';
    import Inbox from '@lucide/svelte/icons/inbox';
    import UserRound from '@lucide/svelte/icons/user-round';
    import * as Sidebar from '@sivir-ui/svelte/components/sidebar';
</script>

<Sidebar.Root collapsible="none" class="h-72 rounded-[var(--radius-xl)] border border-border">
    <Sidebar.Panel>
        <Sidebar.Content>
            <Sidebar.Group>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        <Sidebar.Item>
                            <Sidebar.ItemButton href="#open" active>
                                <Inbox aria-hidden="true" />
                                <Sidebar.ItemLabel>Open</Sidebar.ItemLabel>
                            </Sidebar.ItemButton>
                            <Sidebar.ItemBadge>3</Sidebar.ItemBadge>
                            <Sidebar.Menu>
                                <Sidebar.Item>
                                    <Sidebar.ItemButton href="#assigned">
                                        <UserRound aria-hidden="true" />
                                        <Sidebar.ItemLabel>Assigned to me</Sidebar.ItemLabel>
                                    </Sidebar.ItemButton>
                                    <Sidebar.ItemBadge>1</Sidebar.ItemBadge>
                                </Sidebar.Item>
                                <Sidebar.Item>
                                    <Sidebar.ItemButton href="#subscribed">
                                        <Bell aria-hidden="true" />
                                        <Sidebar.ItemLabel>Subscribed</Sidebar.ItemLabel>
                                    </Sidebar.ItemButton>
                                    <Sidebar.ItemBadge>2</Sidebar.ItemBadge>
                                </Sidebar.Item>
                            </Sidebar.Menu>
                        </Sidebar.Item>
                        <Sidebar.Item>
                            <Sidebar.ItemButton href="#later">
                                <Clock aria-hidden="true" />
                                <Sidebar.ItemLabel>Later</Sidebar.ItemLabel>
                            </Sidebar.ItemButton>
                        </Sidebar.Item>
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        </Sidebar.Content>
    </Sidebar.Panel>
    <Sidebar.Inset>
        <p class="p-5 text-foreground-muted">
            A menu inside an item becomes its indented sub-list.
        </p>
    </Sidebar.Inset>
</Sidebar.Root>
