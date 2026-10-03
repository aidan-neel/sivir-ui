<script lang="ts">
    import * as Command from '@sivir-ui/svelte/components/command';
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    let modalOpen = $state(false);
    let selected = $state<string>();
</script>

<output data-testid="modal-open-state">{String(modalOpen)}</output>
<output data-testid="selected">{selected ?? ''}</output>

<Modal.Root bind:open={modalOpen}>
    <Modal.Trigger>
        <span data-testid="modal-trigger">Open modal</span>
    </Modal.Trigger>
    <Modal.Content>
        <Modal.Body>
            <Command.Root>
                <Command.Trigger>
                    <span data-testid="command-trigger">Open command</span>
                </Command.Trigger>
                <Command.Content>
                    <Command.Search placeholder="Search commands" />
                    <Command.Results>
                        <Command.Item
                            name="profile"
                            callback={() => {
                                selected = 'profile';
                            }}
                        >
                            <span data-testid="cmd-profile">Profile</span>
                        </Command.Item>
                    </Command.Results>
                </Command.Content>
            </Command.Root>
        </Modal.Body>
        <Modal.Footer>
            <Modal.Confirm disabled={!selected}>
                Save
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
