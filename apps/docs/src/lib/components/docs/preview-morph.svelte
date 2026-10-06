<script lang="ts">
    import type { Snippet } from 'svelte';
    import { quartOut } from 'svelte/easing';
    import { prefersReducedMotion } from 'svelte/motion';

    let {
        key,
        children
    }: {
        key: string;
        children: Snippet;
    } = $props();

    const IN_DURATION = 240;
    const OUT_DURATION = 160;
    const MAX_BLUR = 2;

    let layer: HTMLDivElement | undefined;
    let previous: DOMRect | undefined;

    $effect.pre(() => {
        void key;
        previous = layer?.getBoundingClientRect();
    });

    function ratio(from: number, to: number) {
        if (from === 0 || to === 0) {
            return 1;
        }
        return from / to;
    }

    function morphIn(node: HTMLElement) {
        const from = previous;
        const to = node.getBoundingClientRect();
        const scaleX = from ? ratio(from.width, to.width) : 0.96;
        const scaleY = from ? ratio(from.height, to.height) : 0.96;

        return {
            duration: prefersReducedMotion.current ? 0 : IN_DURATION,
            easing: quartOut,
            css: (t: number, u: number) => {
                const x = scaleX + (1 - scaleX) * t;
                const y = scaleY + (1 - scaleY) * t;

                return `opacity: ${t}; filter: blur(${u * MAX_BLUR}px); transform: scale(${x}, ${y});`;
            }
        };
    }

    function morphOut(node: HTMLElement) {
        const from = node.getBoundingClientRect();
        const to = layer?.getBoundingClientRect();
        const scaleX = to ? ratio(to.width, from.width) : 0.96;
        const scaleY = to ? ratio(to.height, from.height) : 0.96;

        return {
            duration: prefersReducedMotion.current ? 0 : OUT_DURATION,
            easing: quartOut,
            css: (t: number, u: number) => {
                const x = scaleX + (1 - scaleX) * t;
                const y = scaleY + (1 - scaleY) * t;

                return `opacity: ${t * t}; filter: blur(${u * MAX_BLUR}px); transform: scale(${x}, ${y});`;
            }
        };
    }
</script>

<div class="grid place-items-center">
    {#key key}
        <div bind:this={layer} class="col-start-1 row-start-1" in:morphIn out:morphOut>
            {@render children()}
        </div>
    {/key}
</div>
