<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { GaugeTrackProps } from '.';
    import { getGaugeContext } from './context.svelte';

    let { class: className, ...rest }: GaugeTrackProps = $props();

    const gauge = getGaugeContext();
</script>

<svg
    data-ui="gauge-track"
    aria-hidden="true"
    viewBox={`0 0 ${gauge.geometry.box} ${gauge.geometry.box}`}
    fill="none"
    class={cn(className, 'absolute inset-0 size-full overflow-visible stroke-foreground/12')}
    {...rest}
>
    <path d={gauge.geometry.path} stroke-width={gauge.geometry.stroke} stroke-linecap="round" />
</svg>
