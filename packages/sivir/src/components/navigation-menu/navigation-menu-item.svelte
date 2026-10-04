<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { NavigationMenuItemProps } from '.';
    import { setNavigationMenuItemContext } from './context.svelte';

    let { value, class: className, children, ...rest }: NavigationMenuItemProps = $props();

    const generatedValue = $props.id();

    setNavigationMenuItemContext({
        get value() {
            return value ?? generatedValue;
        }
    });
</script>

<li data-ui="navigation-menu-item" class={cn(className, 'relative')} {...rest}>
    {@render children?.()}
</li>
