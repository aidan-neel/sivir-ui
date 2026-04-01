<script lang="ts">
    import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { ContextMenuSubContentProps } from '.';

    const key = getContext('key')

    let { class: className, children, ...rest }: ContextMenuSubContentProps = $props();
</script>

<Popover.Content {...rest} portal={false} data-ui="context-submenu-content" class={cn(className, "bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-[var(--panel-border)] rounded-[var(--panel-radius)] shadow-[inset_0_1px_0_var(--panel-highlight),var(--panel-shadow)] p-1")}>
    {@render children?.()}
</Popover.Content>
