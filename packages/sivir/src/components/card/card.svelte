<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { CardProps } from '.';
    import { type CardFooterSlot, setCardContext } from './context.svelte';

    let { children, class: classProp, variant = 'default', ...rest }: CardProps = $props();
    const card = $state({
        variant,
        footerSlot: undefined as CardFooterSlot | undefined
    });
    setCardContext(card);

    $effect(() => {
        card.variant = variant;
    });
</script>

{#if variant === 'inset'}
    <div
        data-ui="card"
        data-variant="inset"
        {...rest}
        class={cn(
            classProp,
            'sivir-modal-frame flex flex-col overflow-hidden shadow-[var(--shadow-card)]'
        )}
    >
        <div
            data-ui="card-surface"
            class={cn('sivir-inset-surface flex min-h-0 flex-1 flex-col p-6')}
        >
            {@render children?.()}
        </div>
        {#if card.footerSlot}
            <div
                {...card.footerSlot.rest}
                data-ui="card-footer"
                class={cn(
                    card.footerSlot.className,
                    'flex w-full flex-row items-center justify-end gap-2 px-1 py-1.5'
                )}
            >
                {@render card.footerSlot.children?.()}
            </div>
        {/if}
    </div>
{:else if variant === 'panel'}
    <div
        data-ui="card"
        data-variant="panel"
        {...rest}
        class={cn(classProp, 'sivir-card-frame flex flex-col')}
    >
        <div
            data-ui="card-surface"
            class={cn('sivir-card-surface flex min-h-0 flex-1 flex-col p-6')}
        >
            {@render children?.()}
        </div>
    </div>
{:else}
    <div
        data-ui="card"
        data-variant="default"
        {...rest}
        class={cn(
            classProp,
            'flex flex-col rounded-[var(--radius-lg)] bg-card p-6 shadow-[var(--shadow-card)]'
        )}
    >
        {@render children?.()}
    </div>
{/if}
