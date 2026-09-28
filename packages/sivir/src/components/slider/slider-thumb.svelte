<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SliderThumbProps } from '.';
    import { getSliderContext } from './context.svelte';

    let { class: className, ...rest }: SliderThumbProps = $props();

    const slider = getSliderContext();
    const TEXT_SELECTOR = '[data-ui="slider-label"], [data-ui="slider-value"]';
    const EDGE_INSET = 4;
    const TEXT_CLEARANCE = 2;

    let element = $state<HTMLSpanElement>();
    let ducked = $state(false);

    const tone = $derived.by(() => {
        if (ducked) {
            return 'scale-y-40 bg-foreground/20 opacity-0';
        }

        if (slider.dragging) {
            return 'scale-y-100 bg-foreground/55';
        }

        if (slider.focusVisible) {
            return 'scale-y-80 bg-foreground/50';
        }

        if (slider.disabled) {
            return 'scale-y-60 bg-foreground/20';
        }

        return 'scale-y-60 bg-foreground/20 group-hover/slider:scale-y-80 group-hover/slider:bg-foreground/35';
    });

    function overlapsText(thumb: HTMLSpanElement) {
        const root = thumb.closest('[data-ui="slider"]');

        if (!root) {
            return false;
        }

        const thumbRect = thumb.getBoundingClientRect();
        const texts = root.querySelectorAll<HTMLElement>(TEXT_SELECTOR);

        for (const text of texts) {
            const textRect = text.getBoundingClientRect();
            const overlaps =
                thumbRect.right > textRect.left - TEXT_CLEARANCE &&
                thumbRect.left < textRect.right + TEXT_CLEARANCE;

            if (overlaps && textRect.width > 0) {
                return true;
            }
        }

        return false;
    }

    $effect(() => {
        void slider.fill;
        void slider.formatted;

        if (element) {
            ducked = overlapsText(element);
        }
    });

    $effect(() => {
        const thumb = element;
        const root = thumb?.closest('[data-ui="slider"]');

        if (!thumb || !root || typeof ResizeObserver === 'undefined') {
            return;
        }

        const observer = new ResizeObserver(() => {
            ducked = overlapsText(thumb);
        });

        observer.observe(root);

        for (const text of root.querySelectorAll<HTMLElement>(TEXT_SELECTOR)) {
            observer.observe(text);
        }

        return () => {
            observer.disconnect();
        };
    });
</script>

<span
    bind:this={element}
    aria-hidden="true"
    data-ui="slider-thumb"
    data-ducked={ducked ? '' : undefined}
    class={cn(
        className,
        'pointer-events-none absolute top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-full transition-[scale,background-color,opacity] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none',
        tone
    )}
    style:left={`max(${EDGE_INSET}px, calc(${slider.fill}% - 7px))`}
    {...rest}
></span>
