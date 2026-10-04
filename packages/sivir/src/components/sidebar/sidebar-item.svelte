<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SidebarItemProps } from '.';
    import { markSidebarItem } from './context.svelte';

    let { class: className, children, ...rest }: SidebarItemProps = $props();

    markSidebarItem();
</script>

<li
    data-ui="sidebar-item"
    class={cn(
        className,
        'relative isolate min-w-0 list-none',
        '[&:has(>[data-ui=sidebar-item-badge],>[data-ui=sidebar-item-action])>[data-ui=sidebar-item-button]]:pr-8',
        '[&:has(>[data-ui=sidebar-item-badge],>[data-ui=sidebar-item-action])>*>[data-ui=sidebar-item-button]]:pr-8',
        '[&:has(>[data-ui=sidebar-item-button]:hover,>[data-ui=sidebar-item-button]:focus-visible,>*>[data-ui=sidebar-item-button]:hover,>*>[data-ui=sidebar-item-button]:focus-visible)>[data-ui=sidebar-item-action]]:opacity-100',
        '[&:has(>[data-ui=sidebar-item-action]):has(>[data-ui=sidebar-item-button]:hover,>[data-ui=sidebar-item-button]:focus-visible,>*>[data-ui=sidebar-item-button]:hover,>*>[data-ui=sidebar-item-button]:focus-visible,>[data-ui=sidebar-item-action]:hover,>[data-ui=sidebar-item-action]:focus-visible)>[data-ui=sidebar-item-badge]]:opacity-0',
        'pointer-coarse:[&:has(>[data-ui=sidebar-item-action])>[data-ui=sidebar-item-badge]]:opacity-0'
    )}
    {...rest}
>
    {@render children?.()}
</li>
