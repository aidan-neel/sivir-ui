<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import CircleAlert from '@lucide/svelte/icons/circle-alert';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ToolTriggerProps } from '.';
    import { getToolContext } from './context.svelte';

    let { title, duration, children, class: className, ...rest }: ToolTriggerProps = $props();

    const tool = getToolContext();
    const glyphClass =
        'col-start-1 row-start-1 inline-flex items-center justify-center transition-[opacity,filter,scale] [transition-duration:var(--motion-duration-swap)] ease-[var(--ease-out)]';
    const hiddenGlyphClass =
        'scale-[var(--motion-swap-scale)] opacity-0 blur-[var(--motion-swap-blur)]';
</script>

<Button
    {...rest}
    type="button"
    variant="quiet"
    data-ui="tool-trigger"
    aria-expanded={tool.open}
    aria-controls={`tool-${tool.id}`}
    onclick={() => (tool.open = !tool.open)}
    class={cn(
        className,
        "group relative flex h-auto min-h-7 max-w-full items-center justify-start rounded-none px-0 text-left leading-[var(--leading-body)] after:absolute after:-inset-1.5 after:content-['']"
    )}
>
    {#if children}
        {@render children({ open: tool.open, state: tool.state })}
    {:else}
        <span
            class={cn(
                'flex max-w-full min-w-0 items-center gap-2 whitespace-nowrap transition-colors [transition-duration:var(--motion-duration-hover)]',
                tool.state === 'error'
                    ? 'text-error'
                    : 'text-foreground-muted group-hover:text-foreground'
            )}
        >
            <span aria-hidden="true" class="grid size-3.5 shrink-0 place-items-center">
                {#if tool.state === 'running'}
                    <span class={glyphClass}>
                        <Spinner size={13} aria-hidden="true" />
                    </span>
                {/if}
                <span
                    class={cn(
                        glyphClass,
                        'text-success',
                        tool.state !== 'complete' && hiddenGlyphClass
                    )}
                >
                    <Check class="size-3.5" />
                </span>
                <span class={cn(glyphClass, tool.state !== 'error' && hiddenGlyphClass)}>
                    <CircleAlert class="size-3.5" />
                </span>
            </span>
            {#if tool.state !== 'complete'}
                <span class="sr-only">{tool.state === 'running' ? 'Running:' : 'Failed:'}</span>
            {/if}
            <span
                class={cn(
                    'min-w-0 truncate font-[var(--font-weight-label)]',
                    tool.state === 'running' && 'sivir-tool-shimmer'
                )}
                >{title}</span
            >
            {#if duration}
                <span class="-ml-1 shrink-0 tabular-nums opacity-70">{duration}</span>
            {/if}
            <ChevronRight
                aria-hidden="true"
                class={cn(
                    '-ml-1 size-3.5 shrink-0 opacity-70 transition-transform [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)]',
                    tool.open && 'rotate-90'
                )}
            />
        </span>
    {/if}
</Button>

<style>
    .sivir-tool-shimmer {
        background: linear-gradient(
            100deg,
            var(--color-foreground-muted) 35%,
            var(--color-foreground) 50%,
            var(--color-foreground-muted) 65%
        );
        background-size: 200% 100%;
        background-clip: text;
        color: transparent;
        animation: sivir-tool-shimmer 1.6s linear infinite;
    }

    @keyframes sivir-tool-shimmer {
        from {
            background-position: 200% 0;
        }
        to {
            background-position: -200% 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-tool-shimmer {
            animation: none;
            background: none;
            color: var(--color-foreground-muted);
        }
    }
</style>
