<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';
    import { getCssDuration } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { untrack } from 'svelte';

    import type { SpinnerProps } from '.';

    type SpinnerPhase = 'loading' | 'success' | 'exiting' | 'hidden';

    const successVisibleDuration = 2000;

    let {
        size = 16,
        ready = false,
        speed = 1,
        curved = false,
        class: classProp,
        'aria-label': ariaLabel,
        'aria-hidden': ariaHidden
    }: SpinnerProps = $props();

    let indicator = $state<HTMLSpanElement>();
    let phase = $state<SpinnerPhase>(untrack(() => ready) ? 'success' : 'loading');
    const spinDuration = $derived(`${850 / (speed > 0 ? speed : 1)}ms`);
    const showCheckmark = $derived(phase === 'success' || phase === 'exiting');

    const faceClass =
        'absolute inset-0 flex items-center justify-center transition-[opacity,scale,rotate,filter] duration-[var(--motion-duration-swap)] ease-[var(--ease-out)] starting:scale-[var(--motion-swap-scale)] starting:opacity-0 starting:blur-[var(--motion-swap-blur)] motion-reduce:transition-none';
    const shownFaceClass = 'rotate-0 scale-100 opacity-100 blur-[0]';
    const hiddenFaceClass =
        'scale-[var(--motion-swap-scale)] opacity-0 blur-[var(--motion-swap-blur)]';

    $effect(() => {
        if (!ready) {
            phase = 'loading';

            return;
        }

        phase = 'success';
        const timer = setTimeout(() => {
            phase = 'exiting';
        }, successVisibleDuration);

        return () => {
            clearTimeout(timer);
        };
    });

    $effect(() => {
        if (phase !== 'exiting') {
            return;
        }

        const duration = indicator
            ? getCssDuration(indicator, '--motion-duration-panel', 180)
            : 180;
        const timer = setTimeout(() => {
            phase = 'hidden';
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    });
</script>

{#if phase !== 'hidden'}
    <span
        bind:this={indicator}
        data-ui="spinner"
        data-phase={phase}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        class={cn(
            classProp,
            'relative inline-flex shrink-0 overflow-hidden transition-[width] duration-[var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none'
        )}
        style:height={`${size}px`}
        style:width={phase === 'exiting' ? '0px' : `${size}px`}
    >
        <span
            class={cn(
                faceClass,
                showCheckmark
                    ? cn(hiddenFaceClass, '-rotate-[var(--motion-swap-rotate)]')
                    : shownFaceClass
            )}
        >
            <LoaderCircle
                {size}
                aria-hidden="true"
                class={cn(
                    curved ? 'animate-[sivir-spinner-spin_linear_infinite]' : 'animate-spin',
                    'motion-reduce:animate-none'
                )}
                style={`animation-duration: ${spinDuration};`}
            />
        </span>
        <span
            class={cn(
                faceClass,
                phase === 'exiting'
                    ? hiddenFaceClass
                    : showCheckmark
                      ? shownFaceClass
                      : cn(hiddenFaceClass, 'rotate-[var(--motion-swap-rotate)]')
            )}
        >
            <Check {size} aria-hidden="true" />
        </span>
    </span>
{/if}

<style>
    :global {
        @keyframes sivir-spinner-spin {
            0% {
                rotate: 0deg;
            }
            12.5% {
                rotate: 36.9deg;
            }
            25% {
                rotate: 78.5deg;
            }
            37.5% {
                rotate: 126.9deg;
            }
            50% {
                rotate: 180deg;
            }
            62.5% {
                rotate: 233.1deg;
            }
            75% {
                rotate: 281.5deg;
            }
            87.5% {
                rotate: 323.1deg;
            }
            100% {
                rotate: 360deg;
            }
        }
    }
</style>
