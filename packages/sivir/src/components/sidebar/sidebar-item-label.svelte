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
        sidebar.rail ? 'text-clip opacity-0' : 'text-ellipsis',
        'min-w-0 flex-1 overflow-hidden leading-normal whitespace-nowrap transition-opacity [transition-duration:var(--motion-duration-hover)] motion-reduce:transition-none'
    )}
    {...rest}
>
    {@render children?.()}
</span>
