<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SourceDescriptionProps } from '.';

    let { class: className, children, ...rest }: SourceDescriptionProps = $props();
</script>

<span
    {...rest}
    data-ui="source-description"
    class={cn(className, 'col-span-full line-clamp-2 text-xs leading-body text-foreground-muted')}
>
    {@render children?.()}
</span>
