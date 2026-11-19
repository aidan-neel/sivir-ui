<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    let open = $state(false);
</script>

<Modal.Root bind:open>
    <Modal.Trigger variant="secondary">Add provider</Modal.Trigger>
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>
                {#snippet context()}
                    Providers
                {/snippet}
                Add provider
            </Modal.Title>
            <Modal.Description>Paste a key to connect this workspace.</Modal.Description>
        </Modal.Header>
        <Input aria-label="API key" placeholder="sk-…" />
        <Modal.Footer>
            {#snippet start()}
                <Button variant="ghost" onclick={() => (open = false)}>Back</Button>
            {/snippet}
            <Modal.Close variant="secondary">
                Cancel
                <Shortcut shortcut="esc" />
            </Modal.Close>
            <Modal.Confirm>
                Connect
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
