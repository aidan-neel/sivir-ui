<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import { ChevronRight } from '@lucide/svelte';
	import * as Popover from '@silk/ui/components/popover';
	import type { ContextMenuSubTriggerProps } from '.';

	let { class: className, children, inset = false, ...rest }: ContextMenuSubTriggerProps = $props();
</script>

<Popover.Trigger
	{...rest}
	class={cn(
		className,
		// token-lint-disable-next-line no-literal-length: menu item text size (14px) is inherent to menu-item-height
		`[--button-height:var(--menu-item-height)] h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] py-0 rounded-[var(--radius-lg)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] duration-150 hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] ${inset ? 'pl-8' : ''} flex w-full items-center justify-between text-left text-[14px] duration-50 hover:cursor-default`
	)}
	variant="ghost"
>
	<span class="min-w-0 flex-1 text-left">
		{@render children?.()}
	</span>
	<ChevronRight class="ml-2 shrink-0 text-foreground-muted" size={18} />
</Popover.Trigger>
