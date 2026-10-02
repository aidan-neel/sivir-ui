<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import { getModalContext } from '../modal/context.svelte';
    import type { CommandFooterProps } from '.';

    let { class: className, children, ...rest }: CommandFooterProps = $props();
    const modal = getModalContext();

    modal.footerSlot = untrack(() => ({
        get children() {
            return children;
        },
        className: cn(className, 'gap-3 text-[length:var(--font-size-meta)] text-foreground-muted'),
        rest
    }));
</script>
