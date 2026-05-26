<script lang="ts">
    import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';
	import { getContext, type Snippet } from 'svelte';

    const key = getContext('key')

    type Props = {
        children: Snippet;
        class: string;
    }

    let props: Props = $props();
</script>

<Popover.Content portal={false} data-ui="dropdown-submenu-content" class={cn(props.class, "bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[var(--panel-shadow)] p-[var(--menu-padding)] flex flex-col gap-0")}>
    {@render props.children?.()}
</Popover.Content>
