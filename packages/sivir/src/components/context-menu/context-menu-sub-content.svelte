<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import { cn } from '@sivir/ui/utils';
	import type { ContextMenuSubContentProps } from '.';

	let { class: className, children, ...rest }: ContextMenuSubContentProps = $props();
</script>

<Popover.Content
	{...rest}
	portal={false}
	data-ui="context-submenu-content"
	class={cn(className, 'min-w-[var(--menu-submenu-min-width)]')}
	surfaceClass="flex flex-col gap-0 p-[var(--menu-padding)]"
>
	{@render children?.()}
</Popover.Content>
