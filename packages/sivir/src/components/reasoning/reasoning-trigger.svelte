<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ReasoningTriggerProps } from '.';
    import { getReasoningContext } from './context.svelte';

    const dotDelays = [0, 1, 2, 1, 2, 3, 2, 3, 4];

    let { title, duration, children, class: className, ...rest }: ReasoningTriggerProps = $props();

    const reasoning = getReasoningContext();
    let thinkingWidth = $state(0);
    let thoughtWidth = $state(0);
    const labelWidth = $derived(reasoning.streaming ? thinkingWidth : thoughtWidth);
</script>

<Button
    {...rest}
    type="button"
    variant="quiet"
    data-ui="reasoning-trigger"
    aria-expanded={reasoning.open}
    aria-controls={`reasoning-${reasoning.id}`}
    onclick={() => (reasoning.open = !reasoning.open)}
    class={cn(
        className,
        "group relative flex h-auto min-h-7 max-w-full items-center justify-start rounded-none px-0 text-left leading-[var(--leading-body)] after:absolute after:-inset-1.5 after:content-['']"
    )}
>
    {#if children}
        {@render children({ open: reasoning.open, streaming: reasoning.streaming })}
    {:else}
        <span
            class="flex max-w-full min-w-0 items-center whitespace-nowrap text-foreground-muted transition-colors [--reasoning-settle:calc(var(--motion-duration-panel)*2)] [transition-duration:var(--motion-duration-hover)] group-hover:text-foreground"
        >
            <span
                aria-hidden="true"
                class={cn(
                    'inline-flex shrink-0 overflow-hidden transition-[width,margin,opacity] [transition-duration:var(--reasoning-settle)] ease-[var(--ease-out)]',
                    reasoning.streaming ? 'mr-2 w-3 opacity-100' : 'mr-0 w-0 opacity-0'
                )}
            >
                <!-- token-lint-disable-next-line no-literal-length: typing-indicator dot geometry -->
                <span class="grid grid-cols-[repeat(3,3px)] gap-[1.5px]">
                    {#each dotDelays as delay, index (index)}
                        <span
                            class={cn(
                                // token-lint-disable-next-line no-literal-length: typing-indicator dot geometry
                                'size-[3px] rounded-full bg-foreground opacity-20',
                                reasoning.streaming && 'sivir-reasoning-dot'
                            )}
                            style:animation-delay={`${delay * 110}ms`}
                        ></span>
                    {/each}
                </span>
            </span>
            {#if title}
                <span
                    class={cn(
                        'min-w-0 truncate font-[var(--font-weight-label)]',
                        reasoning.streaming && 'sivir-reasoning-shimmer'
                    )}
                    >{title}</span
                >
            {:else}
                <span
                    class="inline-grid font-[var(--font-weight-label)] transition-[width] [transition-duration:var(--motion-duration-swap)] ease-[var(--ease-out)]"
                    style:width={labelWidth ? `${labelWidth}px` : undefined}
                >
                    <span
                        bind:offsetWidth={thinkingWidth}
                        aria-hidden={!reasoning.streaming}
                        class={cn(
                            'w-max transition-[opacity,filter] [grid-area:1/1] [transition-duration:var(--motion-duration-swap)] ease-[var(--ease-out)]',
                            reasoning.streaming
                                ? 'sivir-reasoning-shimmer opacity-100 blur-[0]'
                                : 'opacity-0 blur-[var(--motion-swap-blur)]'
                        )}
                        >Thinking</span
                    >
                    <span
                        bind:offsetWidth={thoughtWidth}
                        aria-hidden={reasoning.streaming}
                        class={cn(
                            'w-max transition-[opacity,filter] [grid-area:1/1] [transition-duration:var(--motion-duration-swap)] ease-[var(--ease-out)]',
                            reasoning.streaming
                                ? 'opacity-0 blur-[var(--motion-swap-blur)]'
                                : 'opacity-100 blur-[0]'
                        )}
                        >{duration ? 'Thought for' : 'Thought'}</span
                    >
                </span>
                {#if duration}
                    <!-- token-lint-disable-next-line no-literal-length: gap scales with the label text -->
                    <span class="ml-[0.3em] tabular-nums opacity-70">{duration}</span>
                {/if}
            {/if}
            <ChevronRight
                aria-hidden="true"
                class={cn(
                    'ml-1 size-3.5 shrink-0 opacity-70 transition-transform [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)]',
                    reasoning.open && 'rotate-90'
                )}
            />
        </span>
    {/if}
</Button>

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
        animation: sivir-reasoning-shimmer 1.6s linear infinite;
    }

    .sivir-reasoning-dot {
        animation: sivir-reasoning-dot 1.1s ease-in-out infinite;
    }

    @keyframes sivir-reasoning-shimmer {
        from {
            background-position: 200% 0;
        }
        to {
            background-position: -200% 0;
        }
    }

    @keyframes sivir-reasoning-dot {
        0%,
        100% {
            opacity: 0.2;
        }
        40% {
            opacity: 1;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-reasoning-shimmer {
            animation: none;
            background: none;
            color: var(--color-foreground-muted);
        }

        .sivir-reasoning-dot {
            animation: none;
            opacity: 0.6;
        }
    }
</style>
