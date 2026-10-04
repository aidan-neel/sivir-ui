<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SidebarGroupLabelProps } from '.';
    import { getSidebarContext, getSidebarGroupContext } from './context.svelte';

    let { class: className, children, ...rest }: SidebarGroupLabelProps = $props();

    const sidebar = getSidebarContext();
    const group = getSidebarGroupContext();
    group.labelled = true;
</script>

<h2
    id={`sidebar-group-label-${group.id}`}
    data-ui="sidebar-group-label"
    class={cn(
        className,
        sidebar.rail && 'invisible h-0 opacity-0',
        'flex h-8 shrink-0 items-center overflow-hidden px-2 [font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] text-foreground-muted transition-[height,opacity,visibility] [transition-duration:var(--motion-duration-sheet)] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none'
    )}
    {...rest}
>
    {#if group.collapsible}
        <button
            type="button"
            aria-expanded={group.open}
            aria-controls={`sidebar-group-content-${group.id}`}
            onclick={() => {
                group.open = !group.open;
            }}
            class="flex h-6 max-w-full min-w-0 items-center gap-1 rounded-[var(--radius-sm)] text-left transition-colors [transition-duration:var(--motion-duration-hover)] hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
        >
            <span class="truncate">{@render children?.()}</span>
            <ChevronRight
                aria-hidden="true"
                class={cn(
                    'size-3.5 shrink-0 transition-transform [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none',
                    group.open && 'rotate-90'
                )}
            />
        </button>
    {:else}
        <span class="truncate">{@render children?.()}</span>
    {/if}
</h2>
