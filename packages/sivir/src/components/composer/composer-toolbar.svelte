<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ComposerToolbarProps } from '.';
    import { getComposerContext } from './context.svelte';

    let {
        children,
        class: className,
        variant = 'chrome',
        'aria-label': ariaLabel = 'Message actions',
        ...rest
    }: ComposerToolbarProps = $props();

    const context = getComposerContext();
</script>

<div
    {...rest}
    data-ui="composer-toolbar"
    data-variant={variant}
    data-state={context.status}
    role="toolbar"
    aria-label={ariaLabel}
    class={cn(
        className,
        'flex min-h-11 w-full min-w-0 flex-wrap items-center justify-between gap-2',
        variant === 'inset'
            ? 'm-1.5 mt-1 rounded-[calc(var(--radius-xl)+var(--spacing)*0.5-var(--border-size))] bg-secondary py-1 pr-1 pl-1.5'
            : 'px-2.5 pt-1 pb-2.5'
    )}
>
    {@render children?.()}
</div>
