<script lang="ts">
    import { cn, travelingHighlight } from '@sivir-ui/svelte/utils';
    import type { SidebarContentProps } from '.';

    let { class: className, children, ...rest }: SidebarContentProps = $props();
</script>

<div
    use:travelingHighlight
    data-ui="sidebar-content"
    class={cn(
        className,
        'flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto overscroll-contain'
    )}
    {...rest}
>
    {@render children?.()}
</div>
