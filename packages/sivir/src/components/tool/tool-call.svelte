<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ToolCallProps } from '.';
    import Panel from './tool-panel.svelte';

    let {
        action,
        target,
        state = 'complete',
        duration,
        open = $bindable(false),
        children,
        class: className,
        ...rest
    }: ToolCallProps = $props();

    const id = $props.id();
    const rowClass =
        'col-span-full grid min-h-7 grid-cols-subgrid items-center text-left text-foreground-muted';
</script>

{#snippet row()}
    <span
        class={cn(
            'whitespace-nowrap',
            state === 'running' && 'sivir-tool-call-shimmer',
            state === 'error' && 'text-error'
        )}
        >{action}</span
    >
    <span
        class="min-w-0 truncate font-mono text-xs text-foreground-muted transition-colors [transition-duration:var(--motion-duration-hover)] group-hover:text-foreground"
        >{target}</span
    >
    {#if state === 'running'}
        <Spinner size={12} aria-hidden="true" class="col-start-3 text-foreground-muted" />
    {:else if state === 'error'}
        <span class="col-start-3 text-error">Failed</span>
    {/if}
    {#if duration}
        <span
            class="col-start-4 justify-self-end font-mono text-xs tabular-nums text-foreground-muted opacity-70"
            >{duration}</span
        >
    {/if}
    {#if children}
        <ChevronRight
            aria-hidden="true"
            class={cn(
                'col-start-5 size-3.5 shrink-0 transition-[transform,opacity] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)]',
                open
                    ? 'rotate-90 opacity-70'
                    : 'opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70'
            )}
        />
    {/if}
{/snippet}

<div
    {...rest}
    data-ui="tool-call"
    data-state={state}
    data-open={children ? open : undefined}
    aria-busy={state === 'running'}
    class={cn(
        className,
        'col-span-full grid grid-cols-subgrid transition-opacity [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] *:col-span-full starting:opacity-0 motion-reduce:transition-none'
    )}
>
    {#if children}
        <button
            type="button"
            aria-expanded={open}
            aria-controls={`tool-call-${id}`}
            onclick={() => (open = !open)}
            class={cn(
                rowClass,
                'group rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]'
            )}
        >
            {@render row()}
        </button>
        <Panel id={`tool-call-${id}`} {open} class="flex flex-col gap-2">
            {@render children()}
        </Panel>
    {:else}
        <div class={rowClass}>
            {@render row()}
        </div>
    {/if}
</div>

<style>
    .sivir-tool-call-shimmer {
        background: linear-gradient(
            100deg,
            var(--color-foreground-muted) 35%,
            var(--color-foreground) 50%,
            var(--color-foreground-muted) 65%
        );
        background-size: 200% 100%;
        background-clip: text;
        color: transparent;
        animation: sivir-tool-call-shimmer 1.6s linear infinite;
    }

    @keyframes sivir-tool-call-shimmer {
        from {
            background-position: 200% 0;
        }
        to {
            background-position: -200% 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-tool-call-shimmer {
            animation: none;
            background: none;
            color: var(--color-foreground-muted);
        }
    }
</style>
