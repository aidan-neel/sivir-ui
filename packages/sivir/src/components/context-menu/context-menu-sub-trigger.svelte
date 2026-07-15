<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import { ChevronRight } from '@lucide/svelte';
	import * as Popover from '@sivir/ui/components/popover';
	import type { ContextMenuSubTriggerProps } from '.';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';

	let { class: className, children, inset = false, ...rest }: ContextMenuSubTriggerProps = $props();
</script>

<Popover.Trigger
	{...rest}
	class={cn(className, `${MENU_ITEM} ${inset ? 'pl-8' : ''}`)}
	variant="ghost"
>
	<span class="min-w-0 flex-1 text-left">
		{@render children?.()}
	</span>
	<ChevronRight class="ml-2 shrink-0 text-foreground-muted" size={18} />
</Popover.Trigger>
