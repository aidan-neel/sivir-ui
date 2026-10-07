<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { onDestroy, untrack } from 'svelte';
    import type { ReasoningContentProps } from '.';
    import { getReasoningContext } from './context.svelte';

    let { class: className, children, ...rest }: ReasoningContentProps = $props();

    const reasoning = getReasoningContext();
    onDestroy(reasoning.registerContent());

    let panel = $state<HTMLDivElement>();
    let opened = false;
    let previousOpen = untrack(() => reasoning.open);
    const mounted = $derived.by(() => {
        if (reasoning.open) {
            opened = true;
        }

        return opened;
    });

    function hasTransition(node: HTMLElement) {
        const durations = getComputedStyle(node).transitionDuration.split(',');

        return durations.some((value) => {
            return Number.parseFloat(value) > 0;
        });
    }

    function handleTransitionEnd(event: TransitionEvent) {
        if (event.target !== event.currentTarget || event.propertyName !== 'grid-template-rows') {
            return;
        }
        reasoning.settle(reasoning.open);
    }

    $effect(() => {
        const open = reasoning.open;

        if (open === previousOpen) {
            return;
        }
        previousOpen = open;

        if (panel && hasTransition(panel)) {
            return;
        }
        queueMicrotask(() => {
            reasoning.settle(open);
        });
    });
</script>

<div
    bind:this={panel}
    id={`reasoning-${reasoning.id}`}
    data-ui="reasoning-content"
    data-state={reasoning.open ? 'open' : 'closed'}
    inert={!reasoning.open}
    ontransitionend={handleTransitionEnd}
    class="grid w-full grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] [transition-duration:calc(var(--motion-duration-panel)*1.5),var(--motion-duration-panel)] ease-[cubic-bezier(0.4,0,0.2,1)] data-[state=open]:grid-rows-[1fr] data-[state=open]:opacity-100"
>
    <div class="min-h-0 overflow-hidden">
        <div
            {...rest}
            class={cn(
                className,
                'mt-2 mb-1 text-sm leading-body text-foreground-muted'
            )}
        >
            {#if mounted}
                {@render children?.()}
            {/if}
        </div>
    </div>
</div>
