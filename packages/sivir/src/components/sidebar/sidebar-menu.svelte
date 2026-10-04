<script lang="ts">
    import { themedSlide } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SidebarMenuProps } from '.';
    import { getSidebarContext, isInsideSidebarItem } from './context.svelte';

    let { class: className, children, ...rest }: SidebarMenuProps = $props();

    const sidebar = getSidebarContext();
    const nested = isInsideSidebarItem();
</script>

{#if !(nested && sidebar.rail)}
    <ul
        transition:themedSlide={{
            durationVar: '--motion-duration-sheet'
        }}
        data-ui="sidebar-menu"
        data-nested={nested ? '' : undefined}
        class={cn(className, nested && 'pt-0.5 pl-6', 'flex min-w-0 flex-col gap-0.5')}
        {...rest}
    >
        {@render children?.()}
    </ul>
{/if}
