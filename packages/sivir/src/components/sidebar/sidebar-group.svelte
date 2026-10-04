<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SidebarGroupProps } from '.';
    import { setSidebarGroupContext } from './context.svelte';

    let {
        collapsible = false,
        open = $bindable(true),
        onOpenChange,
        class: className,
        children,
        ...rest
    }: SidebarGroupProps = $props();

    const id = $props.id();
    let labelled = $state(false);

    setSidebarGroupContext({
        id,
        get collapsible() {
            return collapsible;
        },
        get open() {
            return open;
        },
        set open(value) {
            if (value === open) {
                return;
            }
            open = value;
            onOpenChange?.(value);
        },
        get labelled() {
            return labelled;
        },
        set labelled(value) {
            labelled = value;
        }
    });
</script>

<section data-ui="sidebar-group" class={cn(className, 'flex min-w-0 flex-col p-2')} {...rest}>
    {@render children?.()}
</section>
