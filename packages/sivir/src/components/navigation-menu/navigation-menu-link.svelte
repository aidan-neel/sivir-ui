<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { NavigationMenuLinkProps } from '.';
    import { getNavigationMenuContext, isInsideNavigationMenuPanel } from './context.svelte';

    let {
        href,
        active = false,
        class: className,
        children,
        onclick: userOnclick,
        onpointerenter: userOnpointerenter,
        ...rest
    }: NavigationMenuLinkProps = $props();

    const root = getNavigationMenuContext();
    const inPanel = isInsideNavigationMenuPanel();

    function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) {
        userOnclick?.(event);
        const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        if (event.defaultPrevented || modified || event.button !== 0) {
            return;
        }
        root.close();
    }

    function handlePointerEnter(
        event: PointerEvent & { currentTarget: EventTarget & HTMLAnchorElement }
    ) {
        userOnpointerenter?.(event);
        if (inPanel || event.pointerType === 'touch') {
            return;
        }
        root.leave();
    }
</script>

<a
    {href}
    data-ui="navigation-menu-link"
    data-collection-item
    aria-current={active ? 'page' : undefined}
    class={cn(
        className,
        inPanel
            ? 'flex flex-col items-start gap-0.5 px-3 py-2 text-sm text-foreground'
            : 'inline-flex h-8 items-center px-3 whitespace-nowrap text-foreground-muted [font-size:var(--font-size-button)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] hover:text-foreground aria-[current=page]:text-foreground',
        'relative z-1 cursor-default rounded-[var(--radius-lg)] no-underline outline-none transition-colors [transition-duration:var(--motion-duration-hover)] focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none'
    )}
    onclick={handleClick}
    onpointerenter={handlePointerEnter}
    {...rest}
>
    {@render children?.()}
</a>
