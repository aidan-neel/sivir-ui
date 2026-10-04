<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SidebarItemActionProps } from '.';
    import { getSidebarContext } from './context.svelte';

    let {
        class: className,
        children,
        element = $bindable(),
        variant = 'ghost',
        size = 'icon',
        ...rest
    }: SidebarItemActionProps = $props();

    const sidebar = getSidebarContext();
</script>

<Button
    bind:element
    data-ui="sidebar-item-action"
    {variant}
    {size}
    class={cn(
        className,
        sidebar.rail && 'hidden',
        'absolute top-1 right-1 z-10 size-6 rounded-[var(--radius-md)] opacity-0 transition-opacity [transition-duration:var(--motion-duration-hover)] hover:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100 motion-reduce:transition-none [&_svg]:size-3.5'
    )}
    {...rest}
>
    {@render children?.()}
</Button>
