<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { NavigationMenuLinkTitleProps } from '.';

    let { class: className, children, ...rest }: NavigationMenuLinkTitleProps = $props();
</script>

<span
    data-ui="navigation-menu-link-title"
    class={cn(
        className,
        'text-sm leading-normal [font-weight:var(--font-weight-label)] text-foreground'
    )}
    {...rest}
>
    {@render children?.()}
</span>
