<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SidebarMenuProps } from '.';
    import { getSidebarContext, isInsideSidebarItem } from './context.svelte';

    let { class: className, children, ...rest }: SidebarMenuProps = $props();

    const sidebar = getSidebarContext();
    const nested = isInsideSidebarItem();
</script>

{#if nested}
    <div
        inert={sidebar.rail}
        class={cn(
            sidebar.rail ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr]',
            'grid transition-[grid-template-rows,opacity] [transition-duration:var(--motion-duration-sheet)] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none'
        )}
    >
        <ul
            data-ui="sidebar-menu"
            data-nested=""
            class={cn(
                className,
                '-mx-1 -my-1 flex min-w-0 flex-col gap-0.5 overflow-hidden pt-1.5 pr-1 pb-1 pl-7'
            )}
            {...rest}
        >
            {@render children?.()}
        </ul>
    </div>
{:else}
    <ul data-ui="sidebar-menu" class={cn(className, 'flex min-w-0 flex-col gap-0.5')} {...rest}>
        {@render children?.()}
    </ul>
{/if}
