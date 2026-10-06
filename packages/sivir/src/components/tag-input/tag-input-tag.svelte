<script lang="ts">
    import X from '@lucide/svelte/icons/x';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { TagInputTagProps } from '.';
    import { getTagInputContext } from './context.svelte';

    let {
        value,
        index,
        removable = true,
        onRemove,
        class: className,
        children,
        ...rest
    }: TagInputTagProps = $props();

    const context = getTagInputContext();
    const canRemove = $derived(removable && !context.disabled);

    function remove() {
        if (onRemove) {
            onRemove(value);

            return;
        }

        if (index !== undefined) {
            context.removeAt(index);

            return;
        }

        context.removeValue(value);
    }

    function handleRemove(event: MouseEvent) {
        event.stopPropagation();

        if (!canRemove) {
            return;
        }

        remove();
        context.focusInput();
    }
</script>

{#snippet label()}
    <span class="min-w-0 flex-1 truncate">
        {#if children}
            {@render children()}
        {:else}
            {value}
        {/if}
    </span>
    {#if canRemove}
        <span
            data-ui="tag-input-tag-remove"
            aria-hidden="true"
            class="grid size-[18px] shrink-0 place-items-center rounded-[calc(var(--radius-md)-3px)] text-foreground-muted transition-[background-color,color] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] group-hover:bg-[color-mix(in_oklab,var(--color-foreground)_9%,transparent)] group-hover:text-foreground group-focus-visible:text-foreground motion-reduce:transition-none"
        >
            <X size={12} strokeWidth={2.25} aria-hidden="true" class="size-3" />
        </span>
    {/if}
{/snippet}

{#if canRemove}
    <Button
        {...rest}
        type="button"
        variant="secondary"
        size="sm"
        data-ui="tag-input-tag"
        aria-label={`Remove ${value}`}
        title={`Remove ${value}`}
        onclick={handleRemove}
        class={cn(
            className,
            'group h-auto min-h-[calc(var(--size-control-md)-var(--border-size)*2-var(--spacing)*2)] max-w-full gap-1 rounded-[var(--radius-md)] bg-[var(--tag-input-chip)] px-0 py-0 pr-1 pl-2.5 text-foreground shadow-[var(--tag-input-chip-shadow)] [font-size:var(--font-size-body)] leading-tight [font-weight:var(--font-weight-badge)] [letter-spacing:var(--tracking-body)] hover:bg-[color-mix(in_oklab,var(--tag-input-chip)_92%,var(--color-foreground))] focus-visible:shadow-[var(--focus-ring),var(--tag-input-chip-shadow)] data-[state=open]:bg-[color-mix(in_oklab,var(--tag-input-chip)_92%,var(--color-foreground))]'
        )}
    >
        {@render label()}
    </Button>
{:else}
    <span
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
        data-ui="tag-input-tag"
        data-disabled={context.disabled || undefined}
        class={cn(
            className,
            'inline-flex min-h-[calc(var(--size-control-md)-var(--border-size)*2-var(--spacing)*2)] max-w-full items-center gap-1 rounded-[var(--radius-md)] bg-[var(--tag-input-chip)] py-0 pr-2.5 pl-2.5 shadow-[var(--tag-input-chip-shadow)] [font-size:var(--font-size-body)] leading-tight [font-weight:var(--font-weight-badge)] [letter-spacing:var(--tracking-body)] text-foreground'
        )}
    >
        {@render label()}
    </span>
{/if}
