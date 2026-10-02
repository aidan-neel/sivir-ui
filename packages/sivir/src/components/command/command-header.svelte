<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import { getModalContext } from '../modal/context.svelte';
    import type { CommandHeaderProps } from '.';

    let { class: className, children, ...rest }: CommandHeaderProps = $props();
    const modal = getModalContext();

    modal.headerSlot = untrack(() => ({
        get children() {
            return children;
        },
        className: cn(className, 'px-3 pt-1.5 pb-1 text-foreground-muted'),
        rest
    }));
</script>
