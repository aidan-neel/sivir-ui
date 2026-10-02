<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
    import * as Command from '@sivir-ui/svelte/components/command';
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    const projects = ['Design system', 'Marketing site', 'Mobile app', 'Internal tools'];

    let open = $state(false);
    let commandOpen = $state(false);
    let selected = $state<string>();
</script>

<Modal.Root bind:open orientation="vertical">
    <Modal.Trigger>Move issue</Modal.Trigger>
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>Move issue</Modal.Title>
            <Modal.Description>Choose the project this issue should live in.</Modal.Description>
        </Modal.Header>
        <Modal.Body>
            <Command.Root bind:open={commandOpen}>
                <Command.Trigger variant="outline" class="w-full justify-between">
                    {selected ?? 'Select a project…'}
                    <ChevronsUpDown size={16} />
                </Command.Trigger>
                <Command.Content>
                    <Command.Search placeholder="Search projects…" />
                    <Command.Results>
                        {#each projects as project (project)}
                            <Command.Item
                                name={project}
                                callback={() => {
                                    selected = project;
                                }}
                            >
                                <span class="flex-1">{project}</span>
                                {#if selected === project}
                                    <Check size={16} />
                                {/if}
                            </Command.Item>
                        {/each}
                    </Command.Results>
                </Command.Content>
            </Command.Root>
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close>
                Cancel
                <Shortcut shortcut="esc" />
            </Modal.Close>
            <Modal.Confirm disabled={!selected}>
                Move
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
