<script lang="ts">
    import { untrack } from 'svelte';
    import type { ModalFooterProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, start, ...rest }: ModalFooterProps = $props();
    const modal = getModalContext();

    modal.footerSlot = untrack(() => ({
        children,
        start,
        className,
        rest
    }));
</script>
