<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';
    import { quintOut } from 'svelte/easing';
    import { Tween } from 'svelte/motion';
    import type { GaugeRootProps, GaugeSize } from '.';
    import { gaugeGeometry, setGaugeContext } from './context.svelte';
    import GaugeIndicator from './gauge-indicator.svelte';
    import GaugeTrack from './gauge-track.svelte';
    import GaugeValue from './gauge-value.svelte';

    let {
        value,
        max = 100,
        label,
        tone = 'primary',
        size = 'md',
        children,
        class: className,
        ...rest
    }: GaugeRootProps = $props();

    const DEFAULT_DURATION = 480;
    const sizeClasses: Record<GaugeSize, string> = {
        sm: 'size-[20px]',
        md: 'size-[32px]',
        lg: 'size-[56px]'
    };

    let element = $state<HTMLDivElement>();

    const safeMax = $derived(Math.max(max, 1));
    const clamped = $derived(Math.min(Math.max(value, 0), safeMax));
    const geometry = $derived(gaugeGeometry(size));
    const accessibleLabel = $derived(label ?? `${clamped} of ${safeMax}`);
    const tween = new Tween(
        untrack(() => {
            return clamped;
        }),
        {
            easing: quintOut
        }
    );

    function readDuration() {
        if (!element || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return 0;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return 0;
        }

        const raw = getComputedStyle(element).getPropertyValue('--motion-duration-gauge').trim();
        const amount = Number.parseFloat(raw);

        if (!Number.isFinite(amount)) {
            return DEFAULT_DURATION;
        }

        return raw.endsWith('ms') ? amount : amount * 1000;
    }

    $effect(() => {
        const target = clamped;
        const settled = untrack(() => {
            return tween.target === target;
        });

        if (settled) {
            return;
        }

        tween.set(target, {
            duration: readDuration()
        });
    });

    setGaugeContext({
        get value() {
            return clamped;
        },
        get current() {
            return Math.min(tween.current, safeMax);
        },
        get max() {
            return safeMax;
        },
        get tone() {
            return tone;
        },
        get size() {
            return size;
        },
        get geometry() {
            return geometry;
        }
    });
</script>

<div
    bind:this={element}
    data-ui="gauge"
    data-size={size}
    data-tone={tone}
    role="meter"
    aria-label={accessibleLabel}
    aria-valuemin={0}
    aria-valuemax={safeMax}
    aria-valuenow={clamped}
    class={cn(className, sizeClasses[size], 'relative inline-grid shrink-0 place-items-center')}
    {...rest}
>
    {#if children}
        {@render children()}
    {:else}
        <GaugeTrack />
        <GaugeIndicator />
        {#if size !== 'sm'}
            <GaugeValue />
        {/if}
    {/if}
</div>
