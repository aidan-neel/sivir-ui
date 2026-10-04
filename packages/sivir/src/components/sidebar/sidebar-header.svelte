<script lang="ts">
    import { cn, travelingHighlight } from '@sivir-ui/svelte/utils';
    import type { SidebarHeaderProps } from '.';

    let { class: className, children, ...rest }: SidebarHeaderProps = $props();
</script>

<div
    use:travelingHighlight
    data-ui="sidebar-header"
    class={cn(className, 'flex shrink-0 flex-col gap-2 p-2')}
    {...rest}
>
    {@render children?.()}
</div>
