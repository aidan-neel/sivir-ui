<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SidebarItemBadgeProps } from '.';
    import { getSidebarContext } from './context.svelte';

    let { class: className, children, ...rest }: SidebarItemBadgeProps = $props();

    const sidebar = getSidebarContext();
</script>

<span
    data-ui="sidebar-item-badge"
    class={cn(
        className,
        sidebar.rail && 'opacity-0',
        'pointer-events-none absolute top-0 right-2 z-10 flex h-8 items-center [font-size:var(--font-size-badge)] [font-weight:var(--font-weight-badge)] text-foreground-muted tabular-nums transition-opacity [transition-duration:var(--motion-duration-hover)] motion-reduce:transition-none'
    )}
    {...rest}
>
    {@render children?.()}
</span>
