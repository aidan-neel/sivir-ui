<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import type { CollapsibleTriggerProps } from '.';
    import { getCollapsibleContext } from './context.svelte';

    let { class: className, children, ...rest }: CollapsibleTriggerProps = $props();
    const { id, state } = getCollapsibleContext();
</script>

<button
    type="button"
    use:pressable
    id={`collapsible-trigger-${id}`}
    data-ui="collapsible-trigger"
    data-state={state.open ? 'open' : 'closed'}
    aria-expanded={state.open}
    aria-controls={`collapsible-${id}`}
    disabled={state.disabled}
    onclick={() => (state.open = !state.open)}
    class={cn(
        className,
        'group/collapsible sivir-press flex w-full items-center gap-2 rounded-[var(--radius-sm)] py-2 text-left text-[length:var(--font-size-body)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] text-foreground underline-offset-4 transition-[color,transform,scale] hover:underline disabled:no-underline [transition-duration:var(--motion-duration-hover),var(--motion-duration-press),var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]'
    )}
    {...rest}
>
    <ChevronRight
        size={16}
        aria-hidden="true"
        class={cn(
            'shrink-0 text-foreground-muted transition-[color,rotate] [transition-duration:var(--motion-duration-hover),var(--motion-duration-panel)] ease-out motion-reduce:transition-none group-hover/collapsible:text-foreground group-disabled/collapsible:text-foreground-muted',
            state.open && 'rotate-90'
        )}
    />
    {@render children?.()}
</button>
