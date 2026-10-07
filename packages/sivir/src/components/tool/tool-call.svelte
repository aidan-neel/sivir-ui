<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import { getCssDuration, themedSlide } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { cubicOut } from 'svelte/easing';
    import type { TransitionConfig } from 'svelte/transition';
    import type { ToolCallProps } from '.';
    import ToolLabel from './tool-label.svelte';
    import Panel from './tool-panel.svelte';

    let {
        action,
        target,
        state = 'complete',
        open = $bindable(false),
        icon,
        children,
        class: className,
        ...rest
    }: ToolCallProps = $props();

    const id = $props.id();
    const running = $derived(state === 'running');
    const failed = $derived(state === 'error');

    function enter(node: Element): TransitionConfig {
        const duration = getCssDuration(node, '--motion-duration-panel', 180) * 2;
        const slide = themedSlide(node, {
            durationVar: '--motion-duration-panel'
        });

        return {
            duration,
            easing: cubicOut,
            css: (t, u) => {
                const geometry = slide.css?.(t, u) ?? '';

                return `${geometry} opacity: ${t}; filter: blur(${u * 3}px); transform: translateY(${u * 4}px);`;
            }
        };
    }
</script>

{#snippet row()}
    <ToolLabel text={action} shimmer={running} class={cn('shrink-0', failed && 'text-error')} />
    {#if target}
        <span
            class="min-w-0 truncate font-mono text-xs text-foreground-muted transition-colors [transition-duration:var(--motion-duration-hover)] group-hover/call-row:text-foreground"
            >{target}</span
        >
    {/if}
    {#if failed}
        <span class="shrink-0 text-xs text-error">Failed</span>
    {/if}
{/snippet}

<li
    {...rest}
    in:enter
    data-ui="tool-call"
    data-state={state}
    data-open={children ? open : undefined}
    aria-busy={running}
    class={cn(
        className,
        'group/call relative grid grid-cols-[0.875rem_minmax(0,1fr)] gap-x-2.5 pb-3 last:pb-0'
    )}
>
    <span
        aria-hidden="true"
        class={cn(
            'flex h-[1lh] items-center justify-center [&_svg]:size-3.5',
            failed ? 'text-error' : 'text-foreground-muted'
        )}
    >
        {#if icon}
            {@render icon()}
        {:else}
            <span class="size-1.5 rounded-full bg-current opacity-60"></span>
        {/if}
    </span>
    <span
        aria-hidden="true"
        class="absolute top-[1lh] bottom-0 left-[calc(0.4375rem-var(--border-size)/2)] w-[length:var(--border-size)] bg-border group-last/call:hidden"
    ></span>

    {#if children}
        <button
            type="button"
            aria-expanded={open}
            aria-controls={`tool-call-${id}`}
            onclick={() => (open = !open)}
            class="group/call-row flex max-w-full min-w-0 cursor-pointer items-center gap-2 justify-self-start rounded-sm text-left text-foreground-muted transition-colors [transition-duration:var(--motion-duration-hover)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        >
            {@render row()}
            <ChevronDown
                aria-hidden="true"
                class={cn(
                    '-ml-0.5 size-3.5 shrink-0 opacity-70 transition-transform [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)]',
                    open && 'rotate-180'
                )}
            />
        </button>
        <div class="col-start-2 min-w-0">
            <Panel id={`tool-call-${id}`} {open} class="flex flex-col gap-2 pt-1.5">
                {@render children()}
            </Panel>
        </div>
    {:else}
        <span class="flex max-w-full min-w-0 items-center gap-2 text-foreground-muted">
            {@render row()}
        </span>
    {/if}
</li>
