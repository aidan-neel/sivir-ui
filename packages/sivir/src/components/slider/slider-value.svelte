<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SliderValueProps } from '.';
    import { getSliderContext } from './context.svelte';

    let { class: className, ...rest }: SliderValueProps = $props();

    const slider = getSliderContext();
</script>

<span
    aria-hidden="true"
    data-ui="slider-value"
    class={cn(className, 'relative z-[1] shrink-0 font-mono tabular-nums text-foreground')}
    {...rest}
>
    {slider.formatted}
</span>
