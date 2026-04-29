<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import type { ContextMenuSeparatorProps } from '.';

    let { children, class: className, ...rest }: ContextMenuSeparatorProps = $props();
</script>

<div {...rest} data-ui="menu-separator" class={cn(className, "bg-[var(--separator-color)] rounded-[var(--radius-xl)] h-[var(--border-size)] w-[calc(100%-1rem)] mx-auto my-1")}>
    {@render children?.()}
</div>
