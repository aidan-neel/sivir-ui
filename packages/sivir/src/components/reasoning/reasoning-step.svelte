<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import { getCssDuration, themedSlide } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { cubicOut } from 'svelte/easing';
    import type { TransitionConfig } from 'svelte/transition';
    import type { ReasoningStepProps } from '.';
    import ReasoningLabel from './reasoning-label.svelte';

    let {
        title,
        status = 'complete',
        collapsible = false,
        open = $bindable(true),
        icon,
        children,
        class: className,
        ...rest
    }: ReasoningStepProps = $props();

    const id = $props.id();
    const active = $derived(status === 'active');
    const expanded = $derived(!collapsible || open);

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

<li
    {...rest}
    in:enter
    data-ui="reasoning-step"
    data-status={status}
    data-state={expanded ? 'open' : 'closed'}
    class={cn(
        className,
        'group/step relative grid grid-cols-[--spacing(3.5)_minmax(0,1fr)] gap-x-2.5 pb-4 last:pb-0'
    )}
>
    <span
        aria-hidden="true"
        class="flex h-[1lh] items-center justify-center text-foreground-muted [&_svg]:size-3.5"
    >
        {#if icon}
            {@render icon()}
        {:else}
            <span class="size-1.5 rounded-full bg-current opacity-60"></span>
        {/if}
    </span>
    <span
        aria-hidden="true"
        class="absolute top-[calc(1lh+--spacing(1))] bottom-1 left-[calc(--spacing(1.75)-var(--border-size)/2)] w-[length:var(--border-size)] bg-border group-last/step:hidden"
    ></span>

    {#if collapsible}
        <button
            type="button"
            aria-expanded={open}
            aria-controls={`reasoning-step-${id}`}
            onclick={() => (open = !open)}
            class="flex min-w-0 max-w-full cursor-pointer items-center gap-1 justify-self-start rounded-sm text-left text-foreground-muted transition-colors [transition-duration:var(--motion-duration-hover)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        >
            <ReasoningLabel text={title} shimmer={active} />
            <ChevronDown
                aria-hidden="true"
                class={cn(
                    'size-3.5 shrink-0 opacity-70 transition-transform [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)]',
                    open && 'rotate-180'
                )}
            />
        </button>
    {:else}
        <span class="flex min-w-0 text-foreground-muted">
            <ReasoningLabel text={title} shimmer={active} />
        </span>
    {/if}

    {#if children}
        <div
            id={`reasoning-step-${id}`}
            data-state={expanded ? 'open' : 'closed'}
            inert={!expanded}
            class="col-start-2 grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] [transition-duration:calc(var(--motion-duration-panel)*1.5),var(--motion-duration-panel)] ease-[cubic-bezier(0.4,0,0.2,1)] data-[state=open]:grid-rows-[1fr] data-[state=open]:opacity-100"
        >
            <div class="min-h-0 overflow-hidden">
                <div class="pt-1 text-foreground">
                    {@render children()}
                </div>
            </div>
        </div>
    {/if}
</li>
