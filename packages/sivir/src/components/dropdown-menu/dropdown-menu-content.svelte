<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';
    import { cn, dynamicWidth, travelingHighlight } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { getDropdownMenuContext } from './context.svelte';

    getDropdownMenuContext();

    type Props = {
        children: Snippet;
        class?: string;
        dynamic?: boolean;
    } & Omit<Popover.PopoverContentProps, 'children' | 'class' | 'surfaceClass'>;

    let { children, class: className, dynamic = false, role = 'menu', ...rest }: Props = $props();
</script>

<Popover.Content
    {...rest}
    {role}
    tabindex={-1}
    focusTrap={false}
    lockScroll={false}
    data-ui="dropdown-menu-content"
    class={cn(className, 'sivir-menu-panel min-w-[var(--popover-trigger-width)] w-max')}
    surfaceClass="flex min-h-0 flex-col overflow-hidden p-0"
>
    <div
        use:travelingHighlight
        use:dynamicWidth={{ enabled: dynamic }}
        class="flex min-h-0 min-w-0 flex-1 flex-col"
    >
        <ScrollArea class={cn(className, 'min-h-0 min-w-0 flex-1')}>
            <div class="p-1">{@render children?.()}</div>
        </ScrollArea>
    </div>
</Popover.Content>
