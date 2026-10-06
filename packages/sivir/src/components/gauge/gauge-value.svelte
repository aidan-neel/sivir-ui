<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { GaugeSize, GaugeValueProps, GaugeValueState } from '.';
    import { getGaugeContext, wholePercent } from './context.svelte';

    let { children, class: className, ...rest }: GaugeValueProps = $props();

    const gauge = getGaugeContext();
    const sizeClasses: Record<GaugeSize, string> = {
        sm: 'text-[length:var(--font-size-meta)]',
        md: 'text-[length:var(--font-size-badge)]',
        lg: 'text-[length:var(--font-size-body)]'
    };

    function decimalsOf(value: number) {
        if (Number.isInteger(value)) {
            return 0;
        }

        const [, fraction = ''] = String(value).split('.');

        return Math.min(fraction.length, 2);
    }

    const reading = $derived<GaugeValueState>({
        value: Number(gauge.current.toFixed(decimalsOf(gauge.value))),
        max: gauge.max,
        percent: wholePercent(gauge.current, gauge.max)
    });
</script>

<span
    data-ui="gauge-value"
    aria-hidden="true"
    class={cn(
        className,
        sizeClasses[gauge.size],
        'relative leading-none text-foreground/70 tabular-nums [font-weight:var(--font-weight-label)]'
    )}
    {...rest}
>
    {#if children}
        {@render children(reading)}
    {:else}
        {reading.percent}
    {/if}
</span>
