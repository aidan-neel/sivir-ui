<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';

    let { class: className, children, start, ...rest }: Modal.ModalFooterProps = $props();
</script>

<Modal.Footer class={className} {start} {...rest}> {@render children?.()} </Modal.Footer>
