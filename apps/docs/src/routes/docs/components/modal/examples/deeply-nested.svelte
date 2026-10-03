<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    const MAX_LEVEL = 5;
    const open = $state<boolean[]>(Array.from({ length: MAX_LEVEL }, () => false));
</script>

{#snippet level(index: number)}
    <Modal.Root bind:open={open[index]} orientation="vertical">
        <Modal.Trigger variant={index === 0 ? 'primary' : 'outline'}>
            {index === 0 ? 'Open level 1' : `Open level ${index + 1}`}
        </Modal.Trigger>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title>Level {index + 1} of {MAX_LEVEL}</Modal.Title>
                <Modal.Description>
                    {#if index === 0}
                        Escape closes this level and returns to the page.
                    {:else}
                        Escape closes this level and returns to level {index}.
                    {/if}
                </Modal.Description>
            </Modal.Header>
            {#if index + 1 < MAX_LEVEL}
                <Modal.Body> {@render level(index + 1)} </Modal.Body>
            {/if}
            <Modal.Footer>
                <Modal.Close>
                    Back
                    <Shortcut shortcut="esc" />
                </Modal.Close>
            </Modal.Footer>
        </Modal.Content>
    </Modal.Root>
{/snippet}

{@render level(0)}
