<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { NavigationMenuLinkDescriptionProps } from '.';

    let { class: className, children, ...rest }: NavigationMenuLinkDescriptionProps = $props();
</script>

<span
    data-ui="navigation-menu-link-description"
    class={cn(className, 'text-sm leading-normal text-foreground-muted')}
    {...rest}
>
    {@render children?.()}
</span>
