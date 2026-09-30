<script lang="ts">
    import Building2 from '@lucide/svelte/icons/building-2';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import * as Select from '@sivir-ui/svelte/components/select';

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

    const docLink = 'https://sivir.dev/d/q3-launch-plan';

    let invite = $state('');

    let collaborators = $state<Collaborator[]>([
        {
            name: 'Maya Chen',
            email: 'maya@sivir.dev',
            role: 'edit'
        },
        {
            name: 'Jonah Park',
            email: 'jonah@sivir.dev',
            role: 'comment'
        }
    ]);

    function initials(name: string) {
        return name
            .split(/[\s@.]+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
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

<div class="flex w-full max-w-md items-center justify-between gap-4">
    <div class="flex min-w-0 flex-col">
        <p class="m-0 truncate text-sm [font-weight:var(--font-weight-label,500)]">
            Q3 launch plan
        </p>
        <p class="m-0 text-xs text-foreground-muted">Edited 4 minutes ago</p>
    </div>

    <Popover.Root placement="bottom-end">
        <Popover.Trigger variant="outline" size="md">Share</Popover.Trigger>
        <Popover.Content class="w-[24rem] max-w-[calc(100vw-2rem)]">
            <div class="flex flex-col gap-4">
                <Popover.Title>Share “Q3 launch plan”</Popover.Title>

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
                            <Avatar.Fallback>AN</Avatar.Fallback>
                        </Avatar.Root>
                        <div class="flex min-w-0 flex-1 flex-col">
                            <p class="m-0 truncate text-sm">Aidan Neel (you)</p>
                            <p class="m-0 truncate text-xs text-foreground-muted">
                                aidan@sivir.dev
                            </p>
                        </div>
                        <p class="m-0 text-sm text-foreground-muted">Owner</p>
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
                                    class="gap-1"
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
                        size="sm"
                    >
                        Copy link
                    </CopyButton>
                </div>
            </div>
        </Popover.Content>
    </Popover.Root>
</div>
