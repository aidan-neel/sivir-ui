<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    let open = $state(false);
</script>

<Modal.Root bind:open orientation="vertical">
    <Modal.Trigger variant="outline">Open large modal</Modal.Trigger>
    <Modal.Content size="lg">
        <Modal.Header>
            <Modal.Title>Workspace settings</Modal.Title>
            <Modal.Description>
                Changes apply to every project in the Design team workspace.
            </Modal.Description>
        </Modal.Header>
        <Modal.Body>
            <p class="text-sm text-foreground-muted">
                New members join as viewers. Admins can change roles from the Members page.
            </p>
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close>
                Cancel
                <Shortcut shortcut="esc" />
            </Modal.Close>
            <Modal.Confirm>
                Save changes
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
