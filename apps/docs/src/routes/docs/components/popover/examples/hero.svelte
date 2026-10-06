<script lang="ts">
    import Building2 from '@lucide/svelte/icons/building-2';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import * as Select from '@sivir-ui/svelte/components/select';

    let {
        placement = 'bottom',
        hoverable = false
    }: {
        placement?: Popover.Placement;
        hoverable?: boolean;
    } = $props();

    type Role = 'edit' | 'comment' | 'view';

    type Collaborator = {
        name: string;
        email: string;
        role: Role;
    };

    const roleLabels: Record<Role, string> = {
        edit: 'Can edit',
        comment: 'Can comment',
        view: 'Can view'
    };

    const roles = Object.keys(roleLabels) as Role[];

    const docLink = 'https://sivir.dev/d/q3-roadmap';

    let invite = $state('');

    let collaborators = $state<Collaborator[]>([
        {
            name: 'Evan',
            email: 'evan@sivir.dev',
            role: 'edit'
        },
        {
            name: 'Priya',
            email: 'priya@sivir.dev',
            role: 'comment'
        }
    ]);

    function initials(name: string) {
        return name
            .split(/[\s@.]+/)
            .slice(0, 2)
            .map((part) => {
                return part.charAt(0).toUpperCase();
            })
            .join('');
    }

    function addCollaborator(event: SubmitEvent) {
        event.preventDefault();

        const email = invite.trim();
        const alreadyInvited = collaborators.some((collaborator) => {
            return collaborator.email.toLowerCase() === email.toLowerCase();
        });

        if (!email || alreadyInvited) {
            return;
        }

        collaborators.push({
            name: email.split('@')[0],
            email,
            role: 'view'
        });
        invite = '';
    }
</script>

<div class="flex w-full max-w-md justify-center">
    <Popover.Root {placement} {hoverable}>
        <Popover.Trigger variant="outline" size="md">Share</Popover.Trigger>
        <Popover.Content aria-label="Share" class="w-[28rem] max-w-[calc(100vw-2rem)]">
            <div class="flex flex-col gap-4">
                <form class="flex items-center gap-2" onsubmit={addCollaborator}>
                    <div class="min-w-0 flex-1">
                        <Input
                            bind:value={invite}
                            type="email"
                            placeholder="Add people by email"
                            aria-label="Email address"
                        />
                    </div>
                    <Button type="submit" size="md" disabled={!invite.trim()}>Invite</Button>
                </form>

                <ul class="m-0 flex list-none flex-col gap-3 p-0">
                    <li class="flex items-center gap-3">
                        <Avatar.Root size="sm">
                            <Avatar.Fallback>S</Avatar.Fallback>
                        </Avatar.Root>
                        <div class="flex min-w-0 flex-1 flex-col">
                            <p class="m-0 truncate text-sm">Seth (you)</p>
                            <p class="m-0 truncate text-xs text-foreground-muted">seth@sivir.dev</p>
                        </div>
                        <p class="m-0 w-40 shrink-0 pr-3 text-right text-sm text-foreground-muted">
                            Owner
                        </p>
                    </li>

                    {#each collaborators as collaborator (collaborator.email)}
                        <li class="flex items-center gap-3">
                            <Avatar.Root size="sm">
                                <Avatar.Fallback>{initials(collaborator.name)}</Avatar.Fallback>
                            </Avatar.Root>
                            <div class="flex min-w-0 flex-1 flex-col">
                                <p class="m-0 truncate text-sm">{collaborator.name}</p>
                                <p class="m-0 truncate text-xs text-foreground-muted">
                                    {collaborator.email}
                                </p>
                            </div>
                            <Select.Root bind:value={collaborator.role}>
                                <Select.Trigger
                                    variant="ghost"
                                    size="sm"
                                    aria-label={`Access for ${collaborator.name}`}
                                    class="w-40 shrink-0 justify-between"
                                >
                                    {roleLabels[collaborator.role]}
                                </Select.Trigger>
                                <Select.Content>
                                    {#each roles as role (role)}
                                        <Select.Item value={role}>{roleLabels[role]}</Select.Item>
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                        </li>
                    {/each}
                </ul>

                <div class="flex items-center gap-3 border-t border-border pt-4">
                    <Building2 size={16} class="shrink-0 text-foreground-muted" />
                    <div class="flex min-w-0 flex-1 flex-col">
                        <p class="m-0 text-sm">Anyone at Sivir with the link</p>
                        <p class="m-0 text-xs text-foreground-muted">Can view</p>
                    </div>
                    <CopyButton
                        text={docLink}
                        label="Copy link"
                        copiedLabel="Copied"
                        variant="outline"
                        class="shrink-0 whitespace-nowrap"
                    >
                        Copy link
                    </CopyButton>
                </div>
            </div>
        </Popover.Content>
    </Popover.Root>
</div>
