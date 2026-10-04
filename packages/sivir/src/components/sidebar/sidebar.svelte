<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import type { SidebarProps } from '.';
    import { type SidebarContext, setSidebarContext } from './context.svelte';

    let {
        open = $bindable(true),
        onOpenChange,
        openMobile = $bindable(false),
        onOpenMobileChange,
        variant = 'sidebar',
        collapsible = 'offcanvas',
        class: className,
        children,
        ...rest
    }: SidebarProps = $props();

    const id = $props.id();
    let isMobile = $state(false);
    let triggerRef = $state<HTMLElement | null>(null);

    function setOpen(value: boolean) {
        if (value === open) {
            return;
        }
        open = value;
        onOpenChange?.(value);
    }

    function setOpenMobile(value: boolean) {
        if (value === openMobile) {
            return;
        }
        openMobile = value;
        onOpenMobileChange?.(value);
    }

    const context: SidebarContext = {
        id,
        get open() {
            return open;
        },
        set open(value) {
            setOpen(value);
        },
        get openMobile() {
            return openMobile;
        },
        set openMobile(value) {
            setOpenMobile(value);
        },
        get isMobile() {
            return isMobile;
        },
        get variant() {
            return variant;
        },
        get collapsible() {
            return collapsible;
        },
        get rail() {
            return !isMobile && collapsible === 'icon' && !open;
        },
        get hidden() {
            return !isMobile && collapsible === 'offcanvas' && !open;
        },
        get triggerRef() {
            return triggerRef;
        },
        set triggerRef(value) {
            triggerRef = value;
        },
        toggle() {
            if (isMobile) {
                setOpenMobile(!openMobile);
                return;
            }
            setOpen(!open);
        }
    };

    setSidebarContext(context);

    $effect(() => {
        const query = window.matchMedia('(max-width: 767.98px)');
        const sync = () => {
            isMobile = query.matches;
            if (!query.matches) {
                setOpenMobile(false);
            }
        };

        untrack(sync);
        query.addEventListener('change', sync);

        return () => {
            query.removeEventListener('change', sync);
        };
    });
</script>

<div
    data-ui="sidebar"
    data-variant={variant}
    data-collapsible={collapsible}
    data-state={open ? 'expanded' : 'collapsed'}
    class={cn(className, 'flex w-full min-w-0 overflow-hidden bg-background text-foreground')}
    {...rest}
>
    {@render children?.()}
</div>
