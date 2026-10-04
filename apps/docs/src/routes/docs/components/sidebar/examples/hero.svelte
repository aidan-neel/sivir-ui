<script lang="ts">
    import Bell from '@lucide/svelte/icons/bell';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import CreditCard from '@lucide/svelte/icons/credit-card';
    import FileText from '@lucide/svelte/icons/file-text';
    import House from '@lucide/svelte/icons/house';
    import Inbox from '@lucide/svelte/icons/inbox';
    import LogOut from '@lucide/svelte/icons/log-out';
    import Plus from '@lucide/svelte/icons/plus';
    import Search from '@lucide/svelte/icons/search';
    import Settings from '@lucide/svelte/icons/settings';
    import SquarePen from '@lucide/svelte/icons/square-pen';
    import Trash from '@lucide/svelte/icons/trash-2';
    import UserPlus from '@lucide/svelte/icons/user-plus';
    import UserRound from '@lucide/svelte/icons/user-round';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Command from '@sivir-ui/svelte/components/command';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import * as Sidebar from '@sivir-ui/svelte/components/sidebar';
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import { cn } from '@sivir-ui/svelte/utils';

    type Page = {
        id: number;
        title: string;
        children: Page[];
    };

    let nextId = 5;
    let pages = $state<Page[]>([
        { id: 1, title: 'Roadmap', children: [] },
        { id: 2, title: 'Weekly planning', children: [] },
        { id: 3, title: 'Design reviews', children: [] },
        { id: 4, title: 'Hiring loop', children: [] }
    ]);
    let trashed = $state<string[]>([]);
    let open = $state(true);
    let active = $state('Inbox');

    let workspace = $state('Acme');
    let commandOpen = $state(false);
    let createOpen = $state(false);
    let settingsOpen = $state(false);
    let inviteOpen = $state(false);
    let newTitle = $state('');
    let parentId = $state<number | null>(null);
    let inviteEmail = $state('');
    let displayName = $state('Aidan');
    let notifications = $state(true);

    const parentTitle = $derived(parentId === null ? undefined : findPage(pages, parentId)?.title);

    function findPage(list: Page[], id: number): Page | undefined {
        for (const page of list) {
            if (page.id === id) {
                return page;
            }

            const child = findPage(page.children, id);

            if (child) {
                return child;
            }
        }

        return undefined;
    }

    function flatten(list: Page[]): Page[] {
        return list.flatMap((page) => [page, ...flatten(page.children)]);
    }

    function removePage(list: Page[], title: string): Page[] {
        return list
            .filter((page) => page.title !== title)
            .map((page) => ({ ...page, children: removePage(page.children, title) }));
    }

    function openCreate(parent: number | null) {
        parentId = parent;
        newTitle = '';
        createOpen = true;
    }

    function createPage() {
        const title = newTitle.trim();

        if (!title) {
            return;
        }

        const page: Page = { id: nextId++, title, children: [] };

        if (parentId === null) {
            pages.push(page);
        } else {
            findPage(pages, parentId)?.children.push(page);
        }

        active = title;
    }

    function trashActivePage() {
        const isPage = flatten(pages).some((page) => page.title === active);

        if (!isPage) {
            return;
        }

        trashed.push(active);
        pages = removePage(pages, active);
        active = 'Home';
    }

    function inviteTeammate() {
        inviteEmail = '';
    }
</script>

{#snippet pageItem(page: Page)}
    <Sidebar.Item>
        <Sidebar.ItemButton
            active={active === page.title}
            tooltip={page.title}
            onclick={() => (active = page.title)}
        >
            <FileText aria-hidden="true" />
            <Sidebar.ItemLabel>{page.title}</Sidebar.ItemLabel>
        </Sidebar.ItemButton>
        <Sidebar.ItemAction
            aria-label={`Add a page inside ${page.title}`}
            onclick={() => openCreate(page.id)}
        >
            <Plus aria-hidden="true" />
        </Sidebar.ItemAction>
        {#if page.children.length > 0}
            <Sidebar.Menu>
                {#each page.children as child (child.id)}
                    {@render pageItem(child)}
                {/each}
            </Sidebar.Menu>
        {/if}
    </Sidebar.Item>
{/snippet}

<Sidebar.Root
    bind:open
    collapsible="icon"
    variant="inset"
    class="h-120 rounded-[var(--radius-xl)] border border-border"
>
    <Sidebar.Panel aria-label="Workspace">
        <Sidebar.Header
            class={cn(!open && 'gap-0', 'flex-row items-center justify-between transition-[gap] [transition-duration:var(--motion-duration-sheet)] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none')}
        >
            <DropdownMenu.Root>
                <DropdownMenu.Trigger variant="ghost" class="min-w-0 justify-start gap-2 px-2">
                    <span
                        class="flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-foreground text-xs text-background"
                        aria-hidden="true"
                        >{workspace.charAt(0)}</span
                    >
                    <Sidebar.ItemLabel>{workspace}</Sidebar.ItemLabel>
                    <ChevronDown
                        aria-hidden="true"
                        class={cn(!open && 'w-0 opacity-0', 'size-3.5 shrink-0 text-foreground-muted transition-[width,opacity] [transition-duration:var(--motion-duration-sheet)] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none')}
                    />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="min-w-[14rem]">
                    <DropdownMenu.Label>Workspaces</DropdownMenu.Label>
                    {#each ['Acme', 'Globex', 'Initech'] as name (name)}
                        <DropdownMenu.Item callback={() => (workspace = name)}>
                            <span class="flex items-center gap-2">
                                <span
                                    class="flex size-4 items-center justify-center rounded-[var(--radius-sm)] bg-foreground text-[10px] text-background"
                                    aria-hidden="true"
                                    >{name.charAt(0)}</span
                                >
                                {name}
                            </span>
                        </DropdownMenu.Item>
                    {/each}
                    <DropdownMenu.Separator />
                    <DropdownMenu.Label>Account</DropdownMenu.Label>
                    <DropdownMenu.Item callback={() => (inviteOpen = true)}>
                        <span class="flex items-center gap-2"
                            ><UserPlus size={13} />
                            Invite teammates</span
                        >
                    </DropdownMenu.Item>
                    <DropdownMenu.Item callback={() => (settingsOpen = true)}>
                        <span class="flex items-center gap-2"
                            ><Settings size={13} />
                            Preferences</span
                        >
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                        <span class="flex items-center gap-2"
                            ><CreditCard size={13} />
                            Billing</span
                        >
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>
                        <span class="flex items-center gap-2"><LogOut size={13} /> Log out</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            <Button
                variant="ghost"
                size="icon"
                aria-label="New page"
                class={cn(!open && 'pointer-events-none w-0 min-w-0 overflow-hidden px-0 opacity-0', 'shrink-0 transition-[width,opacity,padding] [transition-duration:var(--motion-duration-sheet)] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none')}
                onclick={() => openCreate(null)}
            >
                <SquarePen aria-hidden="true" />
            </Button>
        </Sidebar.Header>
        <Sidebar.Content>
            <Sidebar.Group>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        <Sidebar.Item>
                            <Sidebar.ItemButton
                                tooltip="Search"
                                onclick={() => (commandOpen = true)}
                            >
                                <Search aria-hidden="true" />
                                <Sidebar.ItemLabel>Search</Sidebar.ItemLabel>
                            </Sidebar.ItemButton>
                        </Sidebar.Item>
                        <Sidebar.Item>
                            <Sidebar.ItemButton
                                active={active === 'Home'}
                                tooltip="Home"
                                onclick={() => (active = 'Home')}
                            >
                                <House aria-hidden="true" />
                                <Sidebar.ItemLabel>Home</Sidebar.ItemLabel>
                            </Sidebar.ItemButton>
                        </Sidebar.Item>
                        <Sidebar.Item>
                            <Sidebar.ItemButton
                                active={active === 'Inbox'}
                                tooltip="Inbox"
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
                                        tooltip="Assigned"
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
                                        tooltip="Subscribed"
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
                        {#each pages as page (page.id)}
                            {@render pageItem(page)}
                        {/each}
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
            <Sidebar.Menu>
                <Sidebar.Item>
                    <Sidebar.ItemButton tooltip="Settings" onclick={() => (settingsOpen = true)}>
                        <Settings aria-hidden="true" />
                        <Sidebar.ItemLabel>Settings</Sidebar.ItemLabel>
                    </Sidebar.ItemButton>
                </Sidebar.Item>
                <Sidebar.Item>
                    <Sidebar.ItemButton
                        active={active === 'Trash'}
                        tooltip="Trash"
                        onclick={() => (active = 'Trash')}
                    >
                        <Trash aria-hidden="true" />
                        <Sidebar.ItemLabel>Trash</Sidebar.ItemLabel>
                    </Sidebar.ItemButton>
                    {#if trashed.length > 0}
                        <Sidebar.ItemBadge>{trashed.length}</Sidebar.ItemBadge>
                    {/if}
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
            {#if active === 'Trash'}
                {#if trashed.length === 0}
                    <p>Nothing in the trash.</p>
                {:else}
                    <p>Moved to trash: {trashed.join(', ')}.</p>
                {/if}
            {:else}
                <p>Collapse the panel to an icon rail with the button in this header.</p>
                <p>
                    Press the + beside a page to nest a new one, or search to jump anywhere in
                    {workspace}.
                </p>
            {/if}
        </div>
    </Sidebar.Inset>
</Sidebar.Root>

<Command.Root bind:open={commandOpen}>
    <Command.Content>
        <Command.Search placeholder="Search pages or run a command…" />
        <Command.Results>
            <Command.Group heading="Jump to">
                <Command.Item name="Home" callback={() => (active = 'Home')}>
                    <House size={16} />
                    Home
                </Command.Item>
                <Command.Item name="Inbox" callback={() => (active = 'Inbox')}>
                    <Inbox size={16} />
                    Inbox
                </Command.Item>
                {#each flatten(pages) as page (page.id)}
                    <Command.Item name={page.title} callback={() => (active = page.title)}>
                        <FileText size={16} />
                        {page.title}
                    </Command.Item>
                {/each}
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Actions">
                <Command.Item name="New page" callback={() => openCreate(null)}>
                    <SquarePen size={16} />
                    <span class="flex-1">New page</span>
                    <Shortcut shortcut="N" />
                </Command.Item>
                <Command.Item name="Move page to trash" callback={trashActivePage}>
                    <Trash size={16} />
                    Move page to trash
                </Command.Item>
                <Command.Item name="Invite teammates" callback={() => (inviteOpen = true)}>
                    <UserPlus size={16} />
                    Invite teammates
                </Command.Item>
                <Command.Item name="Settings" callback={() => (settingsOpen = true)}>
                    <Settings size={16} />
                    Settings
                </Command.Item>
            </Command.Group>
        </Command.Results>
    </Command.Content>
</Command.Root>

<Modal.Root bind:open={createOpen} orientation="vertical">
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>New page</Modal.Title>
            <Modal.Description>
                {parentTitle ? `Create a page inside ${parentTitle}.` : `Add a page to ${workspace}.`}
            </Modal.Description>
        </Modal.Header>
        <Modal.Body class="gap-4">
            <Input bind:value={newTitle} label="Title" placeholder="Untitled" />
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close>
                Cancel
                <Shortcut shortcut="esc" />
            </Modal.Close>
            <Modal.Confirm onclick={createPage} disabled={newTitle.trim() === ''}>
                Create
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>

<Modal.Root bind:open={settingsOpen} orientation="vertical">
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>Settings</Modal.Title>
            <Modal.Description>Manage how you appear and what you hear about.</Modal.Description>
        </Modal.Header>
        <Modal.Body class="gap-4">
            <Input bind:value={displayName} label="Display name" />
            <Switch
                bind:checked={notifications}
                label="Email notifications"
                description="Get a digest when someone mentions you."
            />
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close>Close</Modal.Close>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>

<Modal.Root bind:open={inviteOpen} orientation="vertical">
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>Invite teammates</Modal.Title>
            <Modal.Description
                >They'll get an email with a link to join {workspace}.</Modal.Description
            >
        </Modal.Header>
        <Modal.Body class="gap-4">
            <Input bind:value={inviteEmail} label="Email" placeholder="teammate@example.com" />
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close>Cancel</Modal.Close>
            <Modal.Confirm onclick={inviteTeammate} disabled={inviteEmail.trim() === ''}>
                Send invite
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
