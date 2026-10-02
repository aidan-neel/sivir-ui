<script lang="ts">
    import { getCssDuration, panelIn, panelOut } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { tick, untrack } from 'svelte';
    import type { AnimationConfig } from 'svelte/animate';
    import { cubicOut } from 'svelte/easing';
    import type { TransitionConfig } from 'svelte/transition';
    import type { AttachmentListProps } from '.';
    import Item from './attachment-item.svelte';
    import { getAttachmentContext } from './context.svelte';

    type Box = {
        height: number;
        paddingTop: string;
        paddingBottom: string;
        marginTop: string;
        marginBottom: string;
    };

    type Rects = {
        from: DOMRect;
        to: DOMRect;
    };

    type Placement = {
        left: number;
        top: number;
        width: number;
        height: number;
    };

    let {
        label = 'Attachments',
        children,
        class: className,
        'aria-label': ariaLabel,
        ...rest
    }: AttachmentListProps = $props();

    const context = getAttachmentContext();
    const layoutEasing = 'cubic-bezier(0.33, 1, 0.68, 1)';

    let list = $state<HTMLUListElement>();
    let resize: Animation | undefined;
    let empty = $state(untrack(() => context.files.length === 0));
    let previous = untrack(() => context.files);
    let origin: DOMRect | undefined;
    let layoutDuration = 0;
    let placements = new WeakMap<Element, Placement>();

    function rendered(element: Element) {
        if (element.getClientRects().length === 0) {
            return false;
        }

        const { position } = getComputedStyle(element);

        return position !== 'absolute' && position !== 'fixed';
    }

    function siblingGap(node: HTMLElement) {
        const parent = node.parentElement;

        if (!parent) {
            return 0;
        }

        const style = getComputedStyle(parent);
        const column = style.display.includes('flex') && style.flexDirection.startsWith('column');
        const stacked = style.display.includes('grid') && !style.gridTemplateColumns.includes(' ');

        if (!column && !stacked) {
            return 0;
        }

        return Number.parseFloat(style.rowGap) || 0;
    }

    function collapsedBox(node: HTMLElement): Box {
        const siblings = Array.from(node.parentElement?.children ?? []).filter((child) => {
            return child !== node && rendered(child);
        });
        const leading = siblings.some((sibling) => {
            return node.compareDocumentPosition(sibling) & Node.DOCUMENT_POSITION_PRECEDING;
        });
        const gap = siblings.length > 0 ? siblingGap(node) : 0;

        return {
            height: 0,
            paddingTop: '0px',
            paddingBottom: '0px',
            marginTop: leading ? `${-gap}px` : '0px',
            marginBottom: leading ? '0px' : `${-gap}px`
        };
    }

    function measure(node: HTMLElement): Box {
        if (node.hidden) {
            return collapsedBox(node);
        }

        const style = getComputedStyle(node);

        return {
            height: node.getBoundingClientRect().height,
            paddingTop: style.paddingTop,
            paddingBottom: style.paddingBottom,
            marginTop: style.marginTop,
            marginBottom: style.marginBottom
        };
    }

    function place(node: HTMLElement, box: DOMRect) {
        const next = new WeakMap<Element, Placement>();

        for (const child of Array.from(node.children)) {
            if (!(child instanceof HTMLElement)) {
                continue;
            }

            const rect = child.getBoundingClientRect();

            next.set(child, {
                left: rect.left - box.left - node.clientLeft,
                top: rect.top - box.top - node.clientTop,
                width: child.offsetWidth,
                height: child.offsetHeight
            });
        }

        return next;
    }

    function settle(node: HTMLElement) {
        node.style.overflow = '';
        node.style.overflowClipMargin = '';
        resize = undefined;
        if (context.files.length === 0) {
            node.hidden = true;
            empty = true;
        }
    }

    function flowsInline(node: HTMLElement) {
        const parent = node.parentElement;

        if (!parent?.matches('[data-ui="composer-form"]')) {
            return false;
        }

        const style = getComputedStyle(parent);

        return style.display.includes('flex') && style.flexDirection.startsWith('row');
    }

    function holdUntilEmpty(node: HTMLElement) {
        const hold = node.animate([], {
            duration: layoutDuration
        });

        resize = hold;
        hold.finished
            .then(() => {
                if (resize === hold) {
                    settle(node);
                }
            })
            .catch(() => undefined);
    }

    function animateHeight(node: HTMLElement, from: Box, collapsing: boolean) {
        resize?.cancel();

        if (layoutDuration === 0 || typeof node.animate !== 'function') {
            settle(node);
            return;
        }

        if (flowsInline(node)) {
            if (collapsing) {
                holdUntilEmpty(node);
            } else {
                settle(node);
            }
            return;
        }

        const to = collapsing ? collapsedBox(node) : measure(node);

        if (from.height === to.height) {
            settle(node);
            return;
        }

        node.style.overflow = 'clip';
        node.style.overflowClipMargin = '6px';

        const animation = node.animate(
            [
                {
                    height: `${from.height}px`,
                    paddingTop: from.paddingTop,
                    paddingBottom: from.paddingBottom,
                    marginTop: from.marginTop,
                    marginBottom: from.marginBottom
                },
                {
                    height: `${to.height}px`,
                    paddingTop: to.paddingTop,
                    paddingBottom: to.paddingBottom,
                    marginTop: to.marginTop,
                    marginBottom: to.marginBottom
                }
            ],
            {
                duration: layoutDuration,
                easing: layoutEasing,
                fill: collapsing ? 'forwards' : 'none'
            }
        );

        resize = animation;
        animation.finished
            .then(() => {
                if (resize === animation) {
                    settle(node);
                    animation.cancel();
                }
            })
            .catch(() => undefined);
    }

    $effect.pre(() => {
        const files = context.files;
        const collapsing = files.length === 0;
        const node = untrack(() => list);
        const added = files.some((file) => {
            return !previous.includes(file);
        });

        previous = files;

        if (!node) {
            return;
        }

        layoutDuration = added
            ? getCssDuration(node, '--motion-duration-panel-in', 110)
            : getCssDuration(node, '--motion-duration-panel-out', 150);
        origin = node.getBoundingClientRect();
        placements = place(node, origin);

        const from = measure(node);

        if (!collapsing) {
            empty = false;
        }

        tick().then(() => {
            animateHeight(node, from, collapsing);
        });
    });

    function reflow(node: Element, { from, to }: Rects): AnimationConfig {
        const current = node.parentElement?.getBoundingClientRect();
        const shiftX = origin && current ? origin.left - current.left : 0;
        const shiftY = origin && current ? origin.top - current.top : 0;
        const dx = from.left - to.left - shiftX;
        const dy = from.top - to.top - shiftY;

        return {
            duration: dx === 0 && dy === 0 ? 0 : layoutDuration,
            easing: cubicOut,
            css: (_t, u) => {
                return `transform:translate(${u * dx}px,${u * dy}px)`;
            }
        };
    }

    function leave(node: HTMLElement): TransitionConfig {
        const placement = placements.get(node);
        const list = node.parentElement;
        const holdsPlace = context.files.length === 0 && list !== null && flowsInline(list);

        if (holdsPlace) {
            node.dataset.holding = '';
        }

        if (placement && !holdsPlace) {
            node.style.position = 'absolute';
            node.style.transform = '';
            node.style.left = `${placement.left}px`;
            node.style.top = `${placement.top}px`;
            node.style.width = `${placement.width}px`;
            node.style.height = `${placement.height}px`;
        }

        node.inert = true;

        return panelOut(node);
    }
</script>

<ul
    {...rest}
    bind:this={list}
    data-ui="attachment-list"
    data-state={empty ? 'empty' : 'populated'}
    aria-label={ariaLabel ?? label}
    hidden={empty}
    class={cn(
        className,
        // token-lint-disable-next-line no-literal-length: minimum attachment card width
        'relative grid min-w-0 grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))] content-start gap-2 [&>li]:min-w-0 in-data-[ui=composer-form]:flex in-data-[ui=composer-form]:flex-none in-data-[ui=composer-form]:flex-wrap in-data-[ui=composer-form]:max-w-full in-data-[ui=composer-form]:gap-1.5 in-data-[ui=composer-form]:ps-3.5 in-data-[ui=composer-form]:pt-3 [&>li[data-holding]]:static!'
    )}
>
    {#each context.files as file (file)}
        <li animate:reflow in:panelIn out:leave>
            {#if children}
                {@render children(file)}
            {:else}
                <Item {file} />
            {/if}
        </li>
    {/each}
</ul>
