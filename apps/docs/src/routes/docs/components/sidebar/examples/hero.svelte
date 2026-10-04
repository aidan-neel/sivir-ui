<script lang="ts">
    import Bell from '@lucide/svelte/icons/bell';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import FileText from '@lucide/svelte/icons/file-text';
    import House from '@lucide/svelte/icons/house';
    import Inbox from '@lucide/svelte/icons/inbox';
    import Plus from '@lucide/svelte/icons/plus';
    import Search from '@lucide/svelte/icons/search';
    import Settings from '@lucide/svelte/icons/settings';
    import SquarePen from '@lucide/svelte/icons/square-pen';
    import Trash from '@lucide/svelte/icons/trash-2';
    import UserRound from '@lucide/svelte/icons/user-round';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Sidebar from '@sivir-ui/svelte/components/sidebar';

    const pages = ['Roadmap', 'Weekly planning', 'Design reviews', 'Hiring loop'];
    let active = $state('Inbox');
</script>

<Sidebar.Root variant="inset" class="h-120 rounded-[var(--radius-xl)] border border-border">
    <Sidebar.Panel aria-label="Workspace">
        <Sidebar.Header class="flex-row items-center justify-between">
            <Button variant="ghost" class="min-w-0 justify-start gap-2 px-2">
                <span
                    class="flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-foreground text-xs text-background"
                    aria-hidden="true"
                    >A</span
                >
                <span class="truncate">Acme</span>
                <ChevronDown aria-hidden="true" class="size-3.5 text-foreground-muted" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="New page">
                <SquarePen aria-hidden="true" />
            </Button>
        </Sidebar.Header>
        <Sidebar.Content>
            <Sidebar.Group>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        <Sidebar.Item>
                            <Sidebar.ItemButton>
                                <Search aria-hidden="true" />
                                <Sidebar.ItemLabel>Search</Sidebar.ItemLabel>
                            </Sidebar.ItemButton>
                        </Sidebar.Item>
                        <Sidebar.Item>
                            <Sidebar.ItemButton
                                active={active === 'Home'}
                                onclick={() => (active = 'Home')}
                            >
                                <House aria-hidden="true" />
                                <Sidebar.ItemLabel>Home</Sidebar.ItemLabel>
                            </Sidebar.ItemButton>
                        </Sidebar.Item>
                        <Sidebar.Item>
                            <Sidebar.ItemButton
                                active={active === 'Inbox'}
                                onclick={() => (active = 'Inbox')}
                            >
                                <Inbox aria-hidden="true" />
                                <Sidebar.ItemLabel>Inbox</Sidebar.ItemLabel>
                            </Sidebar.ItemButton>
                            <Sidebar.ItemBadge>3</Sidebar.ItemBadge>
                            <Sidebar.Menu>
                                <Sidebar.Item>
                                    <Sidebar.ItemButton
                                        active={active === 'Assigned'}
                                        onclick={() => (active = 'Assigned')}
                                    >
                                        <UserRound aria-hidden="true" />
                                        <Sidebar.ItemLabel>Assigned to me</Sidebar.ItemLabel>
                                    </Sidebar.ItemButton>
                                    <Sidebar.ItemBadge>1</Sidebar.ItemBadge>
                                </Sidebar.Item>
                                <Sidebar.Item>
                                    <Sidebar.ItemButton
                                        active={active === 'Subscribed'}
                                        onclick={() => (active = 'Subscribed')}
                                    >
                                        <Bell aria-hidden="true" />
                                        <Sidebar.ItemLabel>Subscribed</Sidebar.ItemLabel>
                                    </Sidebar.ItemButton>
                                    <Sidebar.ItemBadge>2</Sidebar.ItemBadge>
                                </Sidebar.Item>
                            </Sidebar.Menu>
                        </Sidebar.Item>
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
            <Sidebar.Group collapsible>
                <Sidebar.GroupLabel>Private</Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        {#each pages as page (page)}
                            <Sidebar.Item>
                                <Sidebar.ItemButton
                                    active={active === page}
                                    onclick={() => (active = page)}
                                >
                                    <FileText aria-hidden="true" />
                                    <Sidebar.ItemLabel>{page}</Sidebar.ItemLabel>
                                </Sidebar.ItemButton>
                                <Sidebar.ItemAction aria-label={`Add a page inside ${page}`}>
                                    <Plus aria-hidden="true" />
                                </Sidebar.ItemAction>
                            </Sidebar.Item>
                        {/each}
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
            <Sidebar.Menu>
                <Sidebar.Item>
                    <Sidebar.ItemButton>
                        <Settings aria-hidden="true" />
                        <Sidebar.ItemLabel>Settings</Sidebar.ItemLabel>
                    </Sidebar.ItemButton>
                </Sidebar.Item>
                <Sidebar.Item>
                    <Sidebar.ItemButton>
                        <Trash aria-hidden="true" />
                        <Sidebar.ItemLabel>Trash</Sidebar.ItemLabel>
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
        <div class="flex flex-col gap-2 p-5 text-foreground-muted">
            <p>Collapse the panel with the button in this header.</p>
        </div>
    </Sidebar.Inset>
</Sidebar.Root>
