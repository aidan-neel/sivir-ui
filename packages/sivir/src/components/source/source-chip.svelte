<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { onDestroy, onMount } from 'svelte';
    import { getPopoverContext } from '../popover/context.svelte';
    import type { SourceRootProps } from '.';

    let {
        href,
        target,
        rel,
        class: className,
        children,
        ...rest
    }: Omit<SourceRootProps, 'open' | 'count' | 'openDelay' | 'closeDelay'> = $props();

    const { state: popoverState } = getPopoverContext();
    const external = $derived(/^https?:\/\//.test(href));

    let element = $state<HTMLAnchorElement>();

    function clearTimers() {
        if (popoverState.hoverTimeout) {
            clearTimeout(popoverState.hoverTimeout);
            popoverState.hoverTimeout = undefined;
        }
        if (popoverState.closeTimeout) {
            clearTimeout(popoverState.closeTimeout);
            popoverState.closeTimeout = undefined;
        }
    }

    function show() {
        clearTimers();
        popoverState.hoverTimeout = setTimeout(() => {
            popoverState.open = true;
            popoverState.hovering = true;
        }, popoverState.delay ?? 0);
    }

    function hide() {
        clearTimers();
        popoverState.closeTimeout = setTimeout(() => {
            popoverState.open = false;
            popoverState.hovering = false;
        }, popoverState.closeDelay ?? 180);
    }

    onMount(() => {
        popoverState.buttonRef = element ?? null;
    });

    onDestroy(clearTimers);
</script>

<a
    {...rest}
    bind:this={element}
    {href}
    target={target ?? (external ? '_blank' : undefined)}
    rel={rel ?? (external ? 'noreferrer noopener' : undefined)}
    data-ui="source"
    onmouseenter={show}
    onmouseleave={hide}
    onfocus={show}
    onblur={hide}
    class={cn(
        className,
        'inline-flex h-6 max-w-full min-w-0 items-center gap-1.5 rounded-full bg-secondary px-2 align-[0.0625em] text-xs leading-none whitespace-nowrap text-foreground-muted no-underline transition-colors [transition-duration:var(--motion-duration-hover)] in-[p]:mx-0.5 in-[p]:h-5 in-[p]:max-w-48 in-[p]:gap-1 in-[p]:px-1.5 hover:bg-[color-mix(in_oklab,var(--color-secondary),var(--color-foreground)_7%)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]'
    )}
>
    {@render children?.()}
</a>
