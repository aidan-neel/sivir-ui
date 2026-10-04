<script lang="ts">
    import type { NavigationMenuContentProps } from '.';
    import {
        getNavigationMenuContext,
        getNavigationMenuItemContext,
        type NavigationMenuPanel
    } from './context.svelte';

    let { class: className, children, ...rest }: NavigationMenuContentProps = $props();

    const root = getNavigationMenuContext();
    const item = getNavigationMenuItemContext();

    const panel: NavigationMenuPanel = {
        get class() {
            return className;
        },
        get children() {
            return children;
        },
        get attributes() {
            return rest;
        }
    };

    $effect(() => {
        return root.registerPanel(item.value, panel);
    });
</script>
