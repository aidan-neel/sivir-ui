<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import { cn } from '@sivir-ui/svelte/utils';
    import { tick } from 'svelte';
    import type { NavigationMenuTriggerProps } from '.';
    import { getNavigationMenuContext, getNavigationMenuItemContext } from './context.svelte';

    let {
        class: className,
        children,
        onclick: userOnclick,
        onkeydown: userOnkeydown,
        onpointerenter: userOnpointerenter,
        onpointerleave: userOnpointerleave,
        ...rest
    }: NavigationMenuTriggerProps = $props();

    const root = getNavigationMenuContext();
    const item = getNavigationMenuItemContext();
    let triggerEl = $state<HTMLButtonElement>();

    const open = $derived(root.value === item.value);

    const focusableSelector =
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    $effect(() => {
        if (!triggerEl) {
            return;
        }

        return root.registerTrigger(item.value, triggerEl);
    });

    function firstPanelFocusable() {
        const panel = document.getElementById(root.contentId(item.value));

        return panel?.querySelector<HTMLElement>(focusableSelector) ?? undefined;
    }

    function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
        userOnclick?.(event);
        if (event.defaultPrevented) {
            return;
        }
        root.clickTrigger(item.value);
    }

    async function handleKeydown(
        event: KeyboardEvent & { currentTarget: EventTarget & HTMLButtonElement }
    ) {
        userOnkeydown?.(event);
        if (event.defaultPrevented) {
            return;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            root.open(item.value, 'keyboard');
            await tick();
            firstPanelFocusable()?.focus();
            return;
        }
        if (event.key === 'Tab' && !event.shiftKey && open) {
            const first = firstPanelFocusable();
            if (first) {
                event.preventDefault();
                first.focus();
            }
        }
    }

    function handlePointerEnter(
        event: PointerEvent & { currentTarget: EventTarget & HTMLButtonElement }
    ) {
        userOnpointerenter?.(event);
        if (event.pointerType === 'touch') {
            return;
        }
        root.hoverTrigger(item.value);
    }

    function handlePointerLeave(
        event: PointerEvent & { currentTarget: EventTarget & HTMLButtonElement }
    ) {
        userOnpointerleave?.(event);
        if (event.pointerType === 'touch') {
            return;
        }
        root.leave();
    }
</script>

<button
    bind:this={triggerEl}
    type="button"
    id={root.triggerId(item.value)}
    data-ui="navigation-menu-trigger"
    data-collection-item
    data-state={open ? 'open' : 'closed'}
    aria-expanded={open}
    aria-controls={open ? root.contentId(item.value) : undefined}
    class={cn(
        className,
        'relative z-1 inline-flex h-8 cursor-default items-center gap-1 rounded-[var(--radius-lg)] px-3 whitespace-nowrap text-foreground-muted outline-none [font-size:var(--font-size-button)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] transition-colors [transition-duration:var(--motion-duration-hover)] hover:text-foreground focus-visible:shadow-[var(--focus-ring)] data-[state=open]:text-foreground motion-reduce:transition-none'
    )}
    onclick={handleClick}
    onkeydown={handleKeydown}
    onpointerenter={handlePointerEnter}
    onpointerleave={handlePointerLeave}
    {...rest}
>
    {@render children?.()}
    <ChevronDown
        aria-hidden="true"
        class={cn(
            open && 'rotate-180',
            'size-3.5 shrink-0 transition-transform [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none'
        )}
    />
</button>
