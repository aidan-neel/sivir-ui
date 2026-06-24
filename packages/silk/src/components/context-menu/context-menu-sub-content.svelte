<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import { cn } from '@silk/ui/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { ContextMenuSubContentProps } from '.';

	const key = getContext('key');

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
