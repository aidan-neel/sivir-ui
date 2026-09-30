<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SliderLabelProps } from '.';
    import { getSliderContext } from './context.svelte';

    let { children, class: className, ...rest }: SliderLabelProps = $props();

    const slider = getSliderContext();
    const tone = $derived.by(() => {
        if (slider.dragging) {
            return 'text-foreground';
        }

        if (slider.disabled) {
            return 'text-foreground-muted';
        }

        return 'text-foreground-muted group-hover/slider:text-foreground';
    });
</script>

<span
    data-ui="slider-label"
    data-scrubbing={slider.dragging ? '' : undefined}
    class={cn(
        className,
        'relative z-[1] grid min-w-0 transition-colors [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] motion-reduce:transition-none',
        tone
    )}
    {...rest}
>
    <span
        class={cn(
            'min-w-0 truncate transition-[font-weight] [grid-area:1/1] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none',
            slider.dragging && '[font-weight:var(--font-weight-header)]'
        )}
    >
        {@render children?.()}
    </span>
    <span
        aria-hidden="true"
        class="invisible min-w-0 truncate [font-weight:var(--font-weight-header)] [grid-area:1/1]"
    >
        {@render children?.()}
    </span>
</span>
