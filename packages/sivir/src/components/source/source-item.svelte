<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SourceItemProps } from '.';

    let { href, target, rel, class: className, children, ...rest }: SourceItemProps = $props();

    const external = $derived(/^https?:\/\//.test(href));
</script>

<a
    {...rest}
    {href}
    target={target ?? (external ? '_blank' : undefined)}
    rel={rel ?? (external ? 'noreferrer noopener' : undefined)}
    data-ui="source-item"
    class={cn(
        className,
        'group/source-item grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-1.5 gap-y-1 rounded-sm text-xs leading-body text-foreground-muted no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]'
    )}
>
    {@render children?.()}
</a>
