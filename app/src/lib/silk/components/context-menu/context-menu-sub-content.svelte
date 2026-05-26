<script lang="ts">
	import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { ContextMenuSubContentProps } from '.';

	const key = getContext('key');

	let { class: className, children, ...rest }: ContextMenuSubContentProps = $props();
</script>

<Popover.Content
	{...rest}
	portal={false}
	data-ui="context-submenu-content"
	class={cn(
		className,
		'min-w-[11rem] bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[var(--panel-shadow)] p-[var(--menu-padding)] flex flex-col gap-0'
	)}
>
	{@render children?.()}
</Popover.Content>
