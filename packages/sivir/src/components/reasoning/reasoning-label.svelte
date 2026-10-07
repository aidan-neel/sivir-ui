<script lang="ts">
    import { getCssDuration } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { cubicOut } from 'svelte/easing';

    let {
        text,
        shimmer = false,
        class: className
    }: {
        text: string;
        shimmer?: boolean;
        class?: string;
    } = $props();

    let measured = $state<DOMRectReadOnly>();

    const width = $derived(measured ? Math.ceil(measured.width) : 0);

    function swap(node: Element) {
        const duration = getCssDuration(node, '--motion-duration-swap', 180);
        const blur = getComputedStyle(node).getPropertyValue('--motion-swap-blur').trim() || '2px';

        return {
            duration,
            easing: cubicOut,
            css: (t: number) => {
                return `overflow: visible; opacity: ${t}; filter: blur(calc(${blur} * ${1 - t}));`;
            }
        };
    }
</script>

<span
    class={cn(
        className,
        'relative inline-grid min-w-0 max-w-full grid-cols-[minmax(0,1fr)] transition-[width] [transition-duration:var(--motion-duration-swap)] ease-[var(--ease-out)]'
    )}
    style:width={width ? `${width}px` : undefined}
>
    <span
        aria-hidden="true"
        bind:contentRect={measured}
        class="pointer-events-none invisible absolute w-max whitespace-nowrap"
        >{text}</span
    >
    {#key text}
        <span
            in:swap
            out:swap
            class={cn(
                'w-max max-w-full truncate whitespace-nowrap [grid-area:1/1]',
                shimmer && 'sivir-reasoning-shimmer'
            )}
            >{text}</span
        >
    {/key}
</span>

<style>
    .sivir-reasoning-shimmer {
        background: linear-gradient(
            100deg,
            var(--color-foreground-muted) 35%,
            var(--color-foreground) 50%,
            var(--color-foreground-muted) 65%
        );
        background-size: 200% 100%;
        background-clip: text;
        color: transparent;
        animation: sivir-reasoning-shimmer 1.8s linear infinite;
    }

    @keyframes sivir-reasoning-shimmer {
        from {
            background-position: 200% 0;
        }
        to {
            background-position: -200% 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-reasoning-shimmer {
            animation: none;
            background: none;
            color: var(--color-foreground-muted);
        }
    }
</style>
