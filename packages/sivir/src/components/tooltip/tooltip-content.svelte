<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import type { TooltipContentProps } from '.';
    import type { TooltipRuntimeState } from './shared-tooltip';

    let { children, class: className }: TooltipContentProps = $props();

    const tip = getContext('sivir-tooltip') as TooltipRuntimeState;

    let el = $state<HTMLElement>();

    function normalize(value: string) {
        return value.replace(/\s+/g, ' ').trim();
    }

    function splitTrailingShortcut(root: HTMLElement) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let label = '';
        let shortcut = '';
        let node = walker.nextNode();

        while (node) {
            const value = node.textContent ?? '';
            if (node.parentElement?.closest('kbd')) {
                shortcut += ` ${value}`;
            } else if (shortcut.trim() && value.trim()) {
                return {
                    text: normalize(root.textContent ?? ''),
                    shortcut: ''
                };
            } else {
                label += value;
            }
            node = walker.nextNode();
        }

        const text = normalize(label);
        if (!text) {
            return {
                text: normalize(shortcut),
                shortcut: ''
            };
        }

        return {
            text,
            shortcut: normalize(shortcut)
        };
    }

    $effect(() => {
        tip.className = className ?? '';
    });

    onMount(() => {
        if (!el) {
            return;
        }
        const sync = () => {
            if (!el) {
                return;
            }
            const parts = splitTrailingShortcut(el);
            tip.text = parts.text;
            tip.shortcut = parts.shortcut;
        };
        sync();
        const mo = new MutationObserver(sync);
        mo.observe(el, { childList: true, characterData: true, subtree: true });
        return () => mo.disconnect();
    });
</script>

<span bind:this={el} aria-hidden="true" class="sr-only"> {@render children?.()} </span>
