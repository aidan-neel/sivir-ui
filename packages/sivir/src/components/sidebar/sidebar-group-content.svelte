<script lang="ts">
    import { themedSlide } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SidebarGroupContentProps } from '.';
    import { getSidebarContext, getSidebarGroupContext } from './context.svelte';

    let { class: className, children, ...rest }: SidebarGroupContentProps = $props();

    const sidebar = getSidebarContext();
    const group = getSidebarGroupContext();
    const visible = $derived(!group.collapsible || group.open || sidebar.rail);
</script>

{#if visible}
    <div
        id={`sidebar-group-content-${group.id}`}
        data-ui="sidebar-group-content"
        role={group.labelled ? 'group' : undefined}
        aria-labelledby={group.labelled ? `sidebar-group-label-${group.id}` : undefined}
        transition:themedSlide={{ durationVar: '--motion-duration-panel', fallback: 180 }}
        class={cn(className, 'min-w-0')}
        {...rest}
    >
        {@render children?.()}
    </div>
{/if}
