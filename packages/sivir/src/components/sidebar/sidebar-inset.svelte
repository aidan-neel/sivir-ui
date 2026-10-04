<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SidebarInsetProps } from '.';
    import { getSidebarContext } from './context.svelte';

    let { class: className, children, ...rest }: SidebarInsetProps = $props();

    const sidebar = getSidebarContext();
</script>

<main
    data-ui="sidebar-inset"
    class={cn(
        className,
        'relative flex min-w-0 flex-1 flex-col overflow-y-auto bg-background',
        sidebar.variant === 'inset' &&
            'md:m-2 md:rounded-[var(--radius-xl)] md:border md:border-border md:bg-card md:shadow-[var(--elevation-1)]'
    )}
    {...rest}
>
    {@render children?.()}
</main>
