<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import type { ContextMenuSeparatorProps } from '.';

    let { children, class: className, ...rest }: ContextMenuSeparatorProps = $props();
</script>

<div {...rest} class={cn(className, "h-[1px] bg-input my-1 mx-[-4px]")}>
    {@render children?.()}
</div>