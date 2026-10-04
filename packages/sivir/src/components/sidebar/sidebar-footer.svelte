<script lang="ts">
    import { cn, travelingHighlight } from '@sivir-ui/svelte/utils';
    import type { SidebarFooterProps } from '.';

    let { class: className, children, ...rest }: SidebarFooterProps = $props();
</script>

<div
    use:travelingHighlight
    data-ui="sidebar-footer"
    class={cn(className, 'flex shrink-0 flex-col gap-2 p-2')}
    {...rest}
>
    {@render children?.()}
</div>
