<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { onDestroy } from 'svelte';
    import { SvelteMap } from 'svelte/reactivity';
    import type { NavigationMenuProps } from '.';
    import {
        type NavigationMenuContext,
        type NavigationMenuOpenReason,
        type NavigationMenuPanel,
        setNavigationMenuContext
    } from './context.svelte';

    let {
        value = $bindable(''),
        onValueChange,
        openDelay = 150,
        closeDelay = 200,
        class: className,
        children,
        ...rest
    }: NavigationMenuProps = $props();

    const id = $props.id();
    const panels = new SvelteMap<string, NavigationMenuPanel>();
    const triggers = new Map<string, HTMLElement>();
    let rootEl = $state<HTMLElement>();
    let viewportEl: HTMLElement | undefined;
    let reason = $state<NavigationMenuOpenReason | null>(null);
    let direction = $state<1 | -1>(1);
    let openTimer: ReturnType<typeof setTimeout> | undefined;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    function clearOpenTimer() {
        clearTimeout(openTimer);
        openTimer = undefined;
    }

    function clearCloseTimer() {
        clearTimeout(closeTimer);
        closeTimer = undefined;
    }

    function setValue(next: string, nextReason: NavigationMenuOpenReason | null) {
        reason = next === '' ? null : nextReason;
        if (next === value) {
            return;
        }
        const from = triggers.get(value);
        const to = triggers.get(next);
        if (from && to) {
            const following = from.compareDocumentPosition(to) & Node.DOCUMENT_POSITION_FOLLOWING;
            direction = following ? 1 : -1;
        }
        value = next;
        onValueChange?.(next);
    }

    function open(next: string, nextReason: NavigationMenuOpenReason) {
        clearOpenTimer();
        clearCloseTimer();
        setValue(next, nextReason);
    }

    function close() {
        clearOpenTimer();
        clearCloseTimer();
        setValue('', null);
    }

    function contains(target: EventTarget | null) {
        if (!(target instanceof Node)) {
            return false;
        }

        return Boolean(rootEl?.contains(target) || viewportEl?.contains(target));
    }

    function scheduleClose() {
        clearOpenTimer();
        if (value === '' || reason !== 'hover') {
            return;
        }
        clearCloseTimer();
        closeTimer = setTimeout(close, closeDelay);
    }

    const context: NavigationMenuContext = {
        id,
        get value() {
            return value;
        },
        get reason() {
            return reason;
        },
        get direction() {
            return direction;
        },
        get rootEl() {
            return rootEl;
        },
        panel(itemValue) {
            return panels.get(itemValue);
        },
        trigger(itemValue) {
            return triggers.get(itemValue);
        },
        registerPanel(itemValue, panel) {
            panels.set(itemValue, panel);

            return () => {
                if (panels.get(itemValue) === panel) {
                    panels.delete(itemValue);
                }
            };
        },
        registerTrigger(itemValue, element) {
            triggers.set(itemValue, element);

            return () => {
                if (triggers.get(itemValue) === element) {
                    triggers.delete(itemValue);
                }
            };
        },
        registerViewport(element) {
            viewportEl = element;

            return () => {
                if (viewportEl === element) {
                    viewportEl = undefined;
                }
            };
        },
        contains,
        hoverTrigger(itemValue) {
            clearCloseTimer();
            if (value === itemValue) {
                return;
            }
            if (value !== '') {
                open(itemValue, reason ?? 'hover');
                return;
            }
            clearOpenTimer();
            openTimer = setTimeout(() => {
                open(itemValue, 'hover');
            }, openDelay);
        },
        leave() {
            scheduleClose();
        },
        enterViewport() {
            clearCloseTimer();
        },
        clickTrigger(itemValue) {
            if (value === itemValue && reason === 'hover') {
                open(itemValue, 'click');
                return;
            }
            if (value === itemValue) {
                close();
                return;
            }
            open(itemValue, 'click');
        },
        open,
        close,
        contentId(itemValue) {
            return `navigation-menu-${id}-content-${itemValue}`;
        },
        triggerId(itemValue) {
            return `navigation-menu-${id}-trigger-${itemValue}`;
        }
    };

    setNavigationMenuContext(context);

    $effect(() => {
        if (value === '') {
            return;
        }

        function handlePointerDown(event: PointerEvent) {
            if (contains(event.target)) {
                return;
            }
            close();
        }

        function handleKeydown(event: KeyboardEvent) {
            if (event.key !== 'Escape' || event.defaultPrevented || !contains(event.target)) {
                return;
            }
            const openTrigger = triggers.get(value);
            event.preventDefault();
            close();
            openTrigger?.focus();
        }

        function handleFocusIn(event: FocusEvent) {
            if (!contains(event.target)) {
                close();
            }
        }

        document.addEventListener('pointerdown', handlePointerDown, true);
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('focusin', handleFocusIn);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown, true);
            document.removeEventListener('keydown', handleKeydown);
            document.removeEventListener('focusin', handleFocusIn);
        };
    });

    onDestroy(() => {
        clearOpenTimer();
        clearCloseTimer();
    });
</script>

<nav bind:this={rootEl} data-ui="navigation-menu" class={cn(className, 'relative')} {...rest}>
    {@render children?.()}
</nav>
