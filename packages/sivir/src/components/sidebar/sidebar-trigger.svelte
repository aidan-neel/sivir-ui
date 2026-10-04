<script lang="ts">
    import PanelLeft from '@lucide/svelte/icons/panel-left';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SidebarTriggerProps } from '.';
    import { getSidebarContext } from './context.svelte';

    let {
        class: className,
        children,
        element = $bindable(),
        onclick: userOnclick,
        variant = 'ghost',
        size = 'icon',
        'aria-label': ariaLabel = 'Toggle sidebar',
        ...rest
    }: SidebarTriggerProps = $props();

    const sidebar = getSidebarContext();
    const expanded = $derived(sidebar.isMobile ? sidebar.openMobile : sidebar.open);
</script>

<Button
    bind:element
    data-ui="sidebar-trigger"
    {variant}
    {size}
    aria-label={ariaLabel}
    aria-expanded={expanded}
    aria-controls={`sidebar-${sidebar.id}`}
    class={cn(className, sidebar.collapsible === 'none' && 'md:hidden')}
    onclick={(event: MouseEvent) => {
        userOnclick?.(event);
        if (event.defaultPrevented) {
            return;
        }
        sidebar.triggerRef = element ?? null;
        sidebar.toggle();
    }}
    {...rest}
>
    {#if children}
        {@render children()}
    {:else}
        <PanelLeft aria-hidden="true" />
    {/if}
</Button>
