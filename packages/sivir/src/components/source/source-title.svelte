<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SourceTitleProps } from '.';

    let { class: className, children, ...rest }: SourceTitleProps = $props();
</script>

<span
    {...rest}
    data-ui="source-title"
    class={cn(
        className,
        'col-span-full block text-sm leading-snug font-[var(--font-weight-label)] text-foreground decoration-foreground-muted underline-offset-2 group-hover/source-item:underline'
    )}
>
    {@render children?.()}
</span>
