<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    let open = $state(false);
</script>

<Modal.Root bind:open orientation="vertical">
    <Modal.Trigger variant="outline">Open compact modal</Modal.Trigger>
    <Modal.Content size="sm">
        <Modal.Header>
            <Modal.Title>Leave without saving?</Modal.Title>
            <Modal.Description>Your edits to this draft will be lost.</Modal.Description>
        </Modal.Header>
        <Modal.Footer>
            <Modal.Close>
                Cancel
                <Shortcut shortcut="esc" />
            </Modal.Close>
            <Modal.Confirm>
                Leave
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
