<script lang="ts">
    import { getCssDuration } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount } from 'svelte';
    import { cubicOut } from 'svelte/easing';
    import type { TransitionConfig } from 'svelte/transition';
    import type { TagInputListProps } from '.';
    import { getTagInputContext } from './context.svelte';
    import Tag from './tag-input-tag.svelte';

    let {
        label = 'Tags',
        class: className,
        children,
        'aria-label': ariaLabel,
        ...rest
    }: TagInputListProps = $props();

    const context = getTagInputContext();

    let mounted = false;

    const keyedTags = $derived.by(() => {
        const seen = new Map<string, number>();

        return context.tags.map((tag, index) => {
            const occurrence = seen.get(tag) ?? 0;
            seen.set(tag, occurrence + 1);

            return {
                index,
                key: `${occurrence}:${tag}`,
                tag
            };
        });
    });

    onMount(() => {
        mounted = true;
    });

    function tagMotion(node: HTMLElement): TransitionConfig {
        if (!mounted) {
            return {
                duration: 0
            };
        }

        const style = getComputedStyle(node);
        const parentStyle = node.parentElement ? getComputedStyle(node.parentElement) : undefined;
        const width = node.getBoundingClientRect().width;
        const gap = Number.parseFloat(parentStyle?.columnGap ?? '') || 0;
        const baseTransform = style.transform === 'none' ? '' : style.transform;

        return {
            duration: getCssDuration(node, '--motion-duration-item', 160) * 1.25,
            easing: cubicOut,
            css: (t, u) => {
                return (
                    'overflow: clip;' +
                    'flex-shrink: 0;' +
                    `--tag-input-tag-width: ${width}px;` +
                    `width: ${t * width}px;` +
                    `margin-inline-end: ${-u * gap}px;` +
                    `opacity: ${t};` +
                    `filter: blur(${u * 2}px);` +
                    `transform: ${baseTransform} scale(${0.9 + t * 0.1});` +
                    'transform-origin: left center;'
                );
            }
        };
    }
</script>

{#if context.tags.length > 0 || children}
    <ul
        {...rest}
        data-ui="tag-input-list"
        aria-label={ariaLabel ?? label}
        class={cn(className, 'contents')}
    >
        {#if children}
            {@render children()}
        {:else}
            {#each keyedTags as item (item.key)}
                <li
                    transition:tagMotion|global
                    class="flex min-w-0 max-w-full [&>*]:min-w-[var(--tag-input-tag-width,0px)]"
                >
                    <Tag value={item.tag} index={item.index} />
                </li>
            {/each}
        {/if}
    </ul>
{/if}
