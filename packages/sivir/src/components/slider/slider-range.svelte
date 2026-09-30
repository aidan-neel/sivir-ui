<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SliderRangeProps } from '.';
    import { getSliderContext } from './context.svelte';

    let { class: className, ...rest }: SliderRangeProps = $props();

    const slider = getSliderContext();
    const tone = $derived.by(() => {
        if (slider.dragging) {
            return 'bg-foreground/10';
        }

        if (slider.disabled) {
            return 'bg-foreground/[0.06]';
        }

        return 'bg-foreground/[0.06] group-hover/slider:bg-foreground/[0.08]';
    });
</script>

<span
    aria-hidden="true"
    data-ui="slider-range"
    class={cn(
        className,
        'pointer-events-none absolute inset-y-0 left-0 transition-[background-color] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] motion-reduce:transition-none',
        tone
    )}
    style:width={`${slider.fill}%`}
    {...rest}
></span>
