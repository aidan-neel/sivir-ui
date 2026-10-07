<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ToolTriggerProps } from '.';
    import { formatSeconds, getToolContext } from './context.svelte';
    import ToolLabel from './tool-label.svelte';

    let { status, summary, icon, children, class: className, ...rest }: ToolTriggerProps = $props();

    const tool = getToolContext();

    const settledLabel = $derived.by(() => {
        if (summary) {
            return summary;
        }
        if (tool.seconds < 1) {
            return 'Finished';
        }

        return `Worked for ${formatSeconds(tool.seconds)}`;
    });
    const label = $derived(tool.running ? (status ?? 'Working') : settledLabel);
    const showTimer = $derived(tool.running && tool.seconds >= 1);
    const triggerState = $derived({
        open: tool.open,
        running: tool.running,
        seconds: tool.seconds
    });
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
        {@render children(triggerState)}
    {:else}
        <span
            class="flex max-w-full min-w-0 items-center gap-2 whitespace-nowrap text-foreground-muted transition-colors [transition-duration:var(--motion-duration-hover)] group-hover:text-foreground"
        >
            {@render icon?.(triggerState)}
            <span class="flex min-w-0 items-center gap-1.5">
                <ToolLabel
                    text={label}
                    shimmer={tool.running}
                    class="font-[var(--font-weight-label)]"
                />
                <span
                    aria-hidden={!showTimer}
                    data-state={showTimer ? 'open' : 'closed'}
                    class="-ml-1.5 grid grid-cols-[0fr] opacity-0 transition-[grid-template-columns,margin-left,opacity] [transition-duration:var(--motion-duration-swap)] ease-[var(--ease-out)] data-[state=open]:ml-0 data-[state=open]:grid-cols-[1fr] data-[state=open]:opacity-100"
                >
                    <span class="min-w-0 overflow-hidden text-xs tabular-nums opacity-70">
                        {formatSeconds(tool.seconds)}
                    </span>
                </span>
                <ChevronDown
                    aria-hidden="true"
                    class={cn(
                        'size-3.5 shrink-0 opacity-70 transition-transform [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)]',
                        tool.open && 'rotate-180'
                    )}
                />
            </span>
        </span>
    {/if}
</Button>
