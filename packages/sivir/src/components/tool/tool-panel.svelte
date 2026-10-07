<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { untrack } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';

    type ToolPanelProps = {
        id: string;
        open: boolean;
        onsettle?: (open: boolean) => void;
        children?: Snippet;
    } & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'>;

    let { id, open, onsettle, children, class: className, ...rest }: ToolPanelProps = $props();

    let panel = $state<HTMLDivElement>();
    let opened = false;
    let previousOpen = untrack(() => open);
    const mounted = $derived.by(() => {
        if (open) {
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
        onsettle?.(open);
    }

    $effect(() => {
        const next = open;

        if (next === previousOpen) {
            return;
        }
        previousOpen = next;

        if (panel && hasTransition(panel)) {
            return;
        }
        queueMicrotask(() => {
            onsettle?.(next);
        });
    });
</script>

<div
    bind:this={panel}
    {id}
    data-state={open ? 'open' : 'closed'}
    inert={!open}
    ontransitionend={handleTransitionEnd}
    class="grid w-full grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] [transition-duration:calc(var(--motion-duration-panel)*1.5),var(--motion-duration-panel)] ease-[cubic-bezier(0.4,0,0.2,1)] data-[state=open]:grid-rows-[1fr] data-[state=open]:opacity-100"
>
    <div class="min-h-0 overflow-hidden">
        <div {...rest} class={cn(className, 'text-sm leading-body text-foreground-muted')}>
            {#if mounted}
                {@render children?.()}
            {/if}
        </div>
    </div>
</div>
