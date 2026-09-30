<script lang="ts">
    import { getCssDuration } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { tick, untrack } from 'svelte';
    import { flip } from 'svelte/animate';
    import { cubicIn, cubicOut } from 'svelte/easing';
    import type { TransitionConfig } from 'svelte/transition';
    import type { AttachmentListProps } from '.';
    import Item from './attachment-item.svelte';
    import { getAttachmentContext } from './context.svelte';

    type Box = {
        height: number;
        paddingTop: string;
        paddingBottom: string;
    };

    let {
        label = 'Attachments',
        children,
        class: className,
        'aria-label': ariaLabel,
        ...rest
    }: AttachmentListProps = $props();

    const context = getAttachmentContext();
    const collapsedBox: Box = {
        height: 0,
        paddingTop: '0px',
        paddingBottom: '0px'
    };

    let list = $state<HTMLUListElement>();
    let resize: Animation | undefined;
    let empty = $state(untrack(() => context.files.length === 0));

    function duration(node: Element) {
        return getCssDuration(node, '--motion-duration-panel', 180) * 1.25;
    }

    function measure(node: HTMLElement): Box {
        if (node.hidden) {
            return collapsedBox;
        }

        const style = getComputedStyle(node);

        return {
            height: node.getBoundingClientRect().height,
            paddingTop: style.paddingTop,
            paddingBottom: style.paddingBottom
        };
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

    function animateHeight(node: HTMLElement, from: Box, collapsing: boolean) {
        resize?.cancel();

        const to = collapsing ? collapsedBox : measure(node);
        const length = duration(node);

        if (from.height === to.height || length === 0 || typeof node.animate !== 'function') {
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
                    paddingBottom: from.paddingBottom
                },
                {
                    height: `${to.height}px`,
                    paddingTop: to.paddingTop,
                    paddingBottom: to.paddingBottom
                }
            ],
            {
                duration: length,
                easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
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
        const collapsing = context.files.length === 0;
        const node = untrack(() => list);

        if (!node) {
            return;
        }

        const from = measure(node);

        if (!collapsing) {
            empty = false;
        }

        tick().then(() => {
            animateHeight(node, from, collapsing);
        });
    });

    function frame(t: number) {
        return `opacity:${t};transform:scale(${0.94 + 0.06 * t});filter:blur(${(1 - t) * 4}px)`;
    }

    function reflow(node: Element, rects: { from: DOMRect; to: DOMRect }) {
        return flip(node, rects, {
            duration: duration(node),
            easing: cubicOut
        });
    }

    function enter(node: HTMLElement): TransitionConfig {
        return {
            duration: duration(node),
            easing: cubicOut,
            css: frame
        };
    }

    function leave(node: HTMLElement): TransitionConfig {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = node;

        node.inert = true;
        node.style.position = 'absolute';
        node.style.left = `${offsetLeft}px`;
        node.style.top = `${offsetTop}px`;
        node.style.width = `${offsetWidth}px`;
        node.style.height = `${offsetHeight}px`;

        return {
            duration: getCssDuration(node, '--motion-duration-panel-out', 150),
            easing: cubicIn,
            css: frame
        };
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
        'relative grid min-w-0 grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))] gap-2 [&>li]:min-w-0'
    )}
>
    {#each context.files as file (file)}
        <li animate:reflow in:enter out:leave>
            {#if children}
                {@render children(file)}
            {:else}
                <Item {file} />
            {/if}
        </li>
    {/each}
</ul>
