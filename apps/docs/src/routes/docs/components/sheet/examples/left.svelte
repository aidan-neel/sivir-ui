<script lang="ts">
    import FolderKanban from '@lucide/svelte/icons/folder-kanban';
    import Home from '@lucide/svelte/icons/home';
    import Inbox from '@lucide/svelte/icons/inbox';
    import Menu from '@lucide/svelte/icons/menu';
    import Settings from '@lucide/svelte/icons/settings';
    import Users from '@lucide/svelte/icons/users';
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Sheet from '@sivir-ui/svelte/components/sheet';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import type { Component } from 'svelte';

    type NavLink = {
        value: string;
        label: string;
        icon: Component;
        count?: number;
    };

    let open = $state(false);
    let current = $state('home');

    const workspace: NavLink[] = [
        { value: 'home', label: 'Home', icon: Home },
        { value: 'inbox', label: 'Inbox', icon: Inbox, count: 3 },
        { value: 'projects', label: 'Projects', icon: FolderKanban }
    ];

    const account: NavLink[] = [
        { value: 'team', label: 'Team', icon: Users },
        { value: 'settings', label: 'Settings', icon: Settings }
    ];

    const groups = [
        { heading: 'Workspace', links: workspace },
        { heading: 'Account', links: account }
    ];

    function navigate(value: string) {
        current = value;
        open = false;
    }
</script>

<Sheet.Root bind:open>
    <Sheet.Trigger variant="outline">
        <Menu size={14} />
        Menu
    </Sheet.Trigger>
    <Sheet.Content side="left">
        <Sheet.Header>
            <Sheet.Title>Sivir</Sheet.Title>
            <Sheet.Description>Engineering workspace</Sheet.Description>
        </Sheet.Header>

        <nav aria-label="App sections" class="flex flex-col gap-5">
            {#each groups as group (group.heading)}
                <div class="flex flex-col gap-1">
                    <Typography.Metadata class="px-2.5 pb-1">{group.heading}</Typography.Metadata>
                    {#each group.links as link (link.value)}
                        <Button
                            variant="ghost"
                            class="w-full justify-start gap-2.5 text-foreground-muted aria-[current=page]:bg-foreground/[0.06] aria-[current=page]:text-foreground"
                            aria-current={current === link.value ? 'page' : undefined}
                            onclick={() => navigate(link.value)}
                        >
                            <link.icon size={16} />
                            {link.label}
                            {#if link.count}
                                <Badge variant="secondary" class="ml-auto">{link.count}</Badge>
                            {/if}
                        </Button>
                    {/each}
                </div>
            {/each}
        </nav>

        <Sheet.Footer>
            <Sheet.Close class="w-full" variant="outline">
                Close
                <Shortcut shortcut="esc" />
            </Sheet.Close>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>
