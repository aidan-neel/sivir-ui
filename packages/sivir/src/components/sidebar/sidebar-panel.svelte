<script lang="ts">
    import { useOverlay } from '@sivir-ui/svelte/components/_internal/overlay';
    import { overlayIn, overlayOut, sheetIn, sheetOut } from '@sivir-ui/svelte/transition';
    import { cn, visualViewportBounds } from '@sivir-ui/svelte/utils';
    import type { SidebarPanelProps } from '.';
    import { getSidebarContext } from './context.svelte';

    let {
        side = 'left',
        'aria-label': ariaLabel = 'Sidebar',
        class: className,
        children,
        ...rest
    }: SidebarPanelProps = $props();

    const sidebar = getSidebarContext();
    let drawerEl = $state<HTMLElement>();
    let portalEl = $state<HTMLDivElement>();

    const width = $derived.by(() => {
        if (sidebar.hidden) {
            return 'w-0';
        }
        if (sidebar.rail) {
            return sidebar.variant === 'inset'
                ? 'w-10'
                : 'w-[calc(var(--spacing)*12+var(--border-size))]';
        }
        return 'w-64';
    });

    const insetEdge = $derived(
        side === 'left'
            ? '[&_[data-ui=sidebar-group]]:pr-0 [&>[data-ui=sidebar-footer]]:pr-0 [&>[data-ui=sidebar-header]]:pr-0'
            : '[&_[data-ui=sidebar-group]]:pl-0 [&>[data-ui=sidebar-footer]]:pl-0 [&>[data-ui=sidebar-header]]:pl-0'
    );

    $effect(() => {
        if (!portalEl) {
            return;
        }
        document.body.appendChild(portalEl);

        return () => {
            portalEl?.remove();
        };
    });

    useOverlay({
        isOpen: () => sidebar.isMobile && sidebar.openMobile,
        panelEl: () => drawerEl,
        onClose: () => {
            sidebar.openMobile = false;
        },
        returnFocus: () => sidebar.triggerRef ?? undefined
    });
</script>

{#if sidebar.isMobile}
    <div bind:this={portalEl} use:visualViewportBounds data-overlay-root>
        {#if sidebar.openMobile}
            <div
                class="pointer-events-none fixed inset-x-0 top-[var(--sivir-viewport-top)] z-40 h-[var(--sivir-viewport-height)] [&>*]:pointer-events-auto"
            >
                <div
                    in:overlayIn
                    out:overlayOut
                    data-ui="sidebar-overlay"
                    class="sivir-overlay-scrim absolute inset-0"
                    aria-hidden="true"
                ></div>
                <div
                    bind:this={drawerEl}
                    id={`sidebar-${sidebar.id}`}
                    data-ui="sidebar-panel"
                    data-side={side}
                    data-mobile=""
                    role="dialog"
                    aria-modal="true"
                    aria-label={ariaLabel}
                    tabindex="-1"
                    in:sheetIn={{ side }}
                    out:sheetOut={{ side }}
                    class={cn(
                        className,
                        'fixed top-[var(--sivir-viewport-top)] flex h-[var(--sivir-viewport-height)] w-72 max-w-[85%] flex-col border-border bg-background text-foreground shadow-[var(--elevation-float)] outline-none will-change-transform',
                        side === 'left' ? 'left-0 border-r' : 'right-0 border-l'
                    )}
                    {...rest}
                >
                    {@render children?.()}
                </div>
            </div>
        {/if}
    </div>
{:else}
    <aside
        id={`sidebar-${sidebar.id}`}
        data-ui="sidebar-panel"
        data-side={side}
        data-state={sidebar.open ? 'expanded' : 'collapsed'}
        aria-label={ariaLabel}
        inert={sidebar.hidden}
        class={cn(
            className,
            width,
            side === 'right' && 'order-last justify-end',
            'hidden shrink-0 overflow-hidden transition-[width] [transition-duration:var(--motion-duration-sheet)] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none md:flex'
        )}
        {...rest}
    >
        <div
            class={cn(
                sidebar.hidden && (side === 'left' ? '-translate-x-full' : 'translate-x-full'),
                sidebar.collapsible === 'offcanvas' ? 'w-64' : 'w-full',
                sidebar.variant === 'sidebar' && (side === 'left' ? 'border-r' : 'border-l'),
                sidebar.variant === 'inset' && insetEdge,
                'flex h-full shrink-0 flex-col border-border transition-transform [transition-duration:var(--motion-duration-sheet)] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none'
            )}
        >
            {@render children?.()}
        </div>
    </aside>
{/if}
