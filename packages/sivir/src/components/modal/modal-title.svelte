<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import { cn } from '@sivir-ui/svelte/utils';
    import { titleClasses } from '../typography/variants';
    import type { ModalTitleProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, context, children, ...rest }: ModalTitleProps = $props();

    const modal = getModalContext();
</script>

<h1
    {...rest}
    id={`${modal.id}-title`}
    data-ui="modal-title"
    class={cn(className, titleClasses, context && 'flex items-center gap-1.5')}
>
    {#if context}
        <span
            data-ui="modal-title-context"
            class="[font-weight:var(--font-weight-body)] text-foreground-muted"
        >
            {@render context()}
        </span>
        <ChevronRight aria-hidden="true" class="size-3.5 shrink-0 text-foreground-muted" />
    {/if}
    {@render children?.()}
</h1>
