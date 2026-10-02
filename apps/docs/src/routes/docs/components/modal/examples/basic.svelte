<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    let open = $state(false);
</script>

<Modal.Root bind:open>
    <Modal.Trigger>Archive project</Modal.Trigger>
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>Archive project?</Modal.Title>
            <Modal.Description
                >Archived projects are read-only until you restore them.</Modal.Description
            >
        </Modal.Header>
        <Modal.Footer>
            <Modal.Close>
                Cancel
                <Shortcut shortcut="esc" />
            </Modal.Close>
            <Modal.Confirm>
                Archive
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
