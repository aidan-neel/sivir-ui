<script lang="ts">
    import { themedSlide } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { CollapsibleContentProps } from '.';
    import { getCollapsibleContext } from './context.svelte';

    let { class: className, children, ...rest }: CollapsibleContentProps = $props();
    const { id, state } = getCollapsibleContext();
</script>

{#if state.open}
    <div
        id={`collapsible-${id}`}
        role="region"
        aria-labelledby={`collapsible-trigger-${id}`}
        data-ui="collapsible-content"
        data-state="open"
        transition:themedSlide={{ durationVar: '--motion-duration-panel', fallback: 220 }}
        class={cn(
            className,
            'overflow-hidden text-[length:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] leading-relaxed text-pretty text-foreground-muted'
        )}
        {...rest}
    >
        <div class="ps-[calc(16px+--spacing(2))] pb-3">
            {@render children?.()}
        </div>
    </div>
{/if}
