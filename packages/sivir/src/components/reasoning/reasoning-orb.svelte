<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ReasoningOrbProps } from '.';

    let { active = false, class: className, ...rest }: ReasoningOrbProps = $props();
</script>

<span
    {...rest}
    aria-hidden="true"
    data-ui="reasoning-orb"
    data-active={active}
    class={cn(className, 'sivir-reasoning-orb relative inline-block size-3.5 shrink-0 overflow-hidden rounded-full')}
>
    <span class="sivir-reasoning-orb-liquid absolute"></span>
</span>

<style>
    .sivir-reasoning-orb {
        background: color-mix(in oklab, var(--color-primary) 18%, var(--color-card));
        box-shadow: inset 0 0 0 0.5px color-mix(in oklab, var(--color-primary) 40%, transparent);
        isolation: isolate;
    }

    .sivir-reasoning-orb::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background:
            radial-gradient(circle at 34% 28%, rgb(255 255 255 / 0.6), transparent 42%),
            radial-gradient(circle at 50% 110%, rgb(0 0 0 / 0.22), transparent 62%);
        pointer-events: none;
    }

    .sivir-reasoning-orb-liquid {
        left: -50%;
        width: 200%;
        height: 200%;
        top: -24%;
        border-radius: 42%;
        background: var(--color-primary);
        animation: sivir-reasoning-orb-wave 2.4s linear infinite;
        animation-play-state: paused;
        transition: top calc(var(--motion-duration-panel) * 4) cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sivir-reasoning-orb[data-active='true'] .sivir-reasoning-orb-liquid {
        top: 42%;
        animation-play-state: running;
    }

    @keyframes sivir-reasoning-orb-wave {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-reasoning-orb-liquid {
            animation: none;
            transition: none;
        }
    }
</style>
