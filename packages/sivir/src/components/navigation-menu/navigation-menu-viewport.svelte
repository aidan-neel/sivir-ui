<script lang="ts">
    import { cubicBezier, getCssDuration, panelIn, panelOut } from '@sivir-ui/svelte/transition';
    import { cn, travelingHighlight } from '@sivir-ui/svelte/utils';
    import type { TransitionConfig } from 'svelte/transition';
    import type { NavigationMenuViewportProps } from '.';
    import { getNavigationMenuContext, markNavigationMenuPanel } from './context.svelte';

    let { class: className, ...rest }: NavigationMenuViewportProps = $props();

    const root = getNavigationMenuContext();
    markNavigationMenuPanel();

    const windowGutter = 8;
    const slideDistance = 32;
    const crossfade = 0.25;
    const morphEase = cubicBezier(0.32, 0.72, 0, 1);
    const linkSelector = '[data-ui="navigation-menu-link"]';
    const focusableSelector =
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    let frameEl = $state<HTMLDivElement>();
    let surfaceEl = $state<HTMLDivElement>();
    let size = $state({
        width: 0,
        height: 0
    });
    let offsetX = $state(0);
    let offsetY = $state(0);
    let ready = $state(false);

    let lastOpenValue = '';
    const displayValue = $derived.by(() => {
        if (root.value !== '') {
            lastOpenValue = root.value;
        }

        return lastOpenValue;
    });
    const panel = $derived(displayValue === '' ? undefined : root.panel(displayValue));

    $effect(() => {
        if (root.value === '') {
            ready = false;
            return;
        }
        if (ready) {
            return;
        }
        const frame = requestAnimationFrame(() => {
            ready = true;
        });

        return () => {
            cancelAnimationFrame(frame);
        };
    });

    function updateOffset() {
        const trigger = root.trigger(displayValue);
        const rootEl = root.rootEl;
        if (!trigger || !rootEl || !frameEl || !surfaceEl) {
            return;
        }
        const triggerLeft = trigger.getBoundingClientRect().left;
        const chrome = frameEl.offsetWidth - surfaceEl.offsetWidth;
        const frameWidth = size.width + chrome;
        const maxLeft = document.documentElement.clientWidth - windowGutter - frameWidth;
        offsetX = Math.max(windowGutter, Math.min(triggerLeft, maxLeft));
        offsetY = rootEl.getBoundingClientRect().bottom;
    }

    $effect(() => {
        if (root.value === '' || size.width === 0) {
            return;
        }
        updateOffset();

        let frame = 0;

        function scheduleOffset() {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(updateOffset);
        }

        window.addEventListener('resize', scheduleOffset);
        window.addEventListener('scroll', scheduleOffset, true);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', scheduleOffset);
            window.removeEventListener('scroll', scheduleOffset, true);
        };
    });

    function portal(node: HTMLElement) {
        document.body.appendChild(node);
        const unregister = root.registerViewport(node);

        return {
            destroy() {
                unregister();
                node.remove();
            }
        };
    }

    function measurePanel(node: HTMLElement, value: string) {
        function write() {
            if (value !== displayValue) {
                return;
            }
            size = {
                width: node.offsetWidth,
                height: node.offsetHeight
            };
        }

        write();
        const observer = new ResizeObserver(write);
        observer.observe(node);

        return {
            destroy() {
                observer.disconnect();
            }
        };
    }

    function slide(node: Element, params: { exit: boolean }): TransitionConfig {
        const duration = getCssDuration(node, '--motion-duration-sheet', 320);
        const sign = params.exit ? -root.direction : root.direction;

        if (params.exit) {
            return {
                duration: duration * crossfade,
                css(t, u) {
                    const offset = morphEase(u) * slideDistance * sign;

                    return `opacity: ${t}; transform: translateX(${offset}px);`;
                }
            };
        }

        return {
            duration,
            css(t) {
                const opacity = Math.min(t / crossfade, 1);
                const offset = (1 - morphEase(t)) * slideDistance * sign;

                return `opacity: ${opacity}; transform: translateX(${offset}px);`;
            }
        };
    }

    $effect(() => {
        if (!frameEl) {
            return;
        }
        const frame = frameEl;

        function handlePointerEnter(event: PointerEvent) {
            if (event.pointerType === 'touch') {
                return;
            }
            root.enterViewport();
        }

        function handlePointerLeave(event: PointerEvent) {
            if (event.pointerType === 'touch') {
                return;
            }
            root.leave();
        }

        function handleKeydown(event: KeyboardEvent) {
            if (!(event.target instanceof HTMLElement)) {
                return;
            }
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                const links = Array.from(frame.querySelectorAll<HTMLElement>(linkSelector));
                const index = links.indexOf(event.target);
                if (index === -1) {
                    return;
                }
                event.preventDefault();
                const step = event.key === 'ArrowDown' ? 1 : -1;
                links[(index + step + links.length) % links.length]?.focus();
                return;
            }
            if (event.key !== 'Tab') {
                return;
            }
            const focusables = Array.from(frame.querySelectorAll<HTMLElement>(focusableSelector));
            if (event.shiftKey && event.target === focusables[0]) {
                event.preventDefault();
                root.trigger(displayValue)?.focus();
                return;
            }
            if (!event.shiftKey && event.target === focusables[focusables.length - 1]) {
                root.trigger(displayValue)?.focus();
                root.close();
            }
        }

        frame.addEventListener('pointerenter', handlePointerEnter);
        frame.addEventListener('pointerleave', handlePointerLeave);
        frame.addEventListener('keydown', handleKeydown);

        return () => {
            frame.removeEventListener('pointerenter', handlePointerEnter);
            frame.removeEventListener('pointerleave', handlePointerLeave);
            frame.removeEventListener('keydown', handleKeydown);
        };
    });
</script>

<div
    use:portal
    class={cn(
        ready &&
            'transition-[translate] [transition-duration:var(--motion-duration-sheet)] ease-[cubic-bezier(0.32,0.72,0,1)]',
        'pointer-events-none fixed top-[var(--navigation-menu-viewport-y)] left-0 z-50 translate-x-[var(--navigation-menu-viewport-x)] motion-reduce:transition-none'
    )}
    style:--navigation-menu-viewport-x="{offsetX}px"
    style:--navigation-menu-viewport-y="{offsetY}px"
>
    {#if root.value !== ''}
        <div
            bind:this={frameEl}
            data-ui="navigation-menu-viewport"
            in:panelIn
            out:panelOut
            class={cn(
                className,
                'pointer-events-auto mt-2 origin-top text-sm text-foreground',
                'sivir-modal-frame shadow-[var(--elevation-float)] [--sivir-modal-inset:calc(var(--spacing)*0.5)]'
            )}
            {...rest}
        >
            <div
                bind:this={surfaceEl}
                class={cn(
                    ready &&
                        'transition-[width,height] [transition-duration:var(--motion-duration-sheet)] ease-[cubic-bezier(0.32,0.72,0,1)]',
                    'sivir-inset-surface relative h-[var(--navigation-menu-viewport-height)] w-[var(--navigation-menu-viewport-width)] overflow-hidden motion-reduce:transition-none'
                )}
                style:--navigation-menu-viewport-width="{size.width}px"
                style:--navigation-menu-viewport-height="{size.height}px"
            >
                {#key displayValue}
                    <div
                        class="absolute top-0 left-0 w-max"
                        use:measurePanel={displayValue}
                        in:slide={{ exit: false }}
                        out:slide={{ exit: true }}
                    >
                        {#if panel}
                            <div
                                id={root.contentId(displayValue)}
                                aria-labelledby={root.triggerId(displayValue)}
                                data-ui="navigation-menu-content"
                                use:travelingHighlight
                                class={cn(
                                    panel.class,
                                    'flex max-w-[calc(100vw-var(--spacing)*6)] flex-col p-1.5'
                                )}
                                {...panel.attributes}
                            >
                                {@render panel.children?.()}
                            </div>
                        {/if}
                    </div>
                {/key}
            </div>
        </div>
    {/if}
</div>
