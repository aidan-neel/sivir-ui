<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { GaugeIndicatorProps, GaugeTone } from '.';
    import { getGaugeContext } from './context.svelte';

    let { class: className, ...rest }: GaugeIndicatorProps = $props();

    const gauge = getGaugeContext();
    const toneClasses: Record<GaugeTone, string> = {
        primary: 'text-primary',
        muted: 'text-foreground-muted',
        success: 'text-success',
        warning: 'text-warning',
        error: 'text-error'
    };

    const fill = $derived((gauge.current / gauge.max) * 100);
</script>

<svg
    data-ui="gauge-indicator"
    aria-hidden="true"
    viewBox={`0 0 ${gauge.geometry.box} ${gauge.geometry.box}`}
    fill="none"
    class={cn(
        className,
        toneClasses[gauge.tone],
        fill <= 0 && 'opacity-0',
        'absolute inset-0 size-full overflow-visible stroke-current transition-[color,opacity] [transition-duration:var(--motion-duration-hover)] ease-out'
    )}
    {...rest}
>
    <path
        d={gauge.geometry.path}
        pathLength="100"
        stroke-dasharray={`${fill} 100`}
        stroke-width={gauge.geometry.stroke}
        stroke-linecap="round"
    />
</svg>
