<script lang="ts">
    import { getCssDuration, panelIn, panelOut } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { flip } from 'svelte/animate';
    import { cubicOut } from 'svelte/easing';
    import type { AttachmentListProps } from '.';
    import Item from './attachment-item.svelte';
    import { getAttachmentContext } from './context.svelte';

    let {
        label = 'Attachments',
        children,
        class: className,
        'aria-label': ariaLabel,
        ...rest
    }: AttachmentListProps = $props();

    const context = getAttachmentContext();

    let leaving = $state(0);

    const empty = $derived(context.files.length === 0 && leaving === 0);

    function reflow(node: Element, rects: { from: DOMRect; to: DOMRect }) {
        return flip(node, rects, {
            duration: getCssDuration(node, '--motion-duration-panel', 180),
            easing: cubicOut
        });
    }

    function leave(node: HTMLElement) {
        node.inert = true;

        return panelOut(node);
    }
</script>

<ul
    {...rest}
    data-ui="attachment-list"
    data-state={empty ? 'empty' : 'populated'}
    aria-label={ariaLabel ?? label}
    hidden={empty}
    class={cn(
        className,
        'relative min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap',
        empty ? 'hidden' : 'flex'
    )}
>
    {#each context.files as file (file)}
        <li
            animate:reflow
            in:panelIn
            out:leave
            onoutrostart={() => {
                leaving += 1;
            }}
            onoutroend={() => {
                leaving = Math.max(0, leaving - 1);
            }}
            class="min-w-0 sm:w-72 sm:flex-none"
        >
            {#if children}
                {@render children(file)}
            {:else}
                <Item {file} />
            {/if}
        </li>
    {/each}
</ul>
