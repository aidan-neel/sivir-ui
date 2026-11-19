<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import { cn } from '@sivir-ui/svelte/utils';

    let { class: className, children, ...rest }: Modal.ModalTitleProps = $props();
</script>

<Modal.Title {...rest} class={cn(className, 'text-xl')}> {@render children?.()} </Modal.Title>
