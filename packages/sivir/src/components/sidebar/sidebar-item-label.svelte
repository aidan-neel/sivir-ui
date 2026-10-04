<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SidebarItemLabelProps } from '.';
    import { getSidebarContext } from './context.svelte';

    let { class: className, children, ...rest }: SidebarItemLabelProps = $props();

    const sidebar = getSidebarContext();
</script>

<span
    data-ui="sidebar-item-label"
    class={cn(
        className,
        sidebar.rail ? 'opacity-0' : 'delay-[var(--motion-duration-hover)]',
        'min-w-0 flex-1 truncate leading-normal transition-opacity [transition-duration:var(--motion-duration-hover)] motion-reduce:transition-none'
    )}
    {...rest}
>
    {@render children?.()}
</span>
