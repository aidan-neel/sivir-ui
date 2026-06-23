<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import { cn } from '@silk/ui/utils';
	import type { HoverCardContentProps } from '.';

	// Note: in 2.0.0 hover-card collapses to a popover wrapper, and popover
	// owns placement at the Root level. The `side` and `align` props on
	// HoverCardContentProps are preserved for type-API stability but are
	// not currently consumed -- placement is set via the Root prop on
	// Popover.Root (HoverCard.Root forwards no placement today; defaults to
	// 'bottom'). A future minor release can either wire these through or
	// deprecate them in docs.
	let {
		class: className,
		children,
		side: _side,
		align: _align,
		...rest
	}: HoverCardContentProps = $props();
</script>

<Popover.Content
	role="dialog"
	aria-modal="false"
	allowClickOutside={false}
	{...rest}
	class={cn(
		className,
		'w-[var(--hover-card-width)] rounded-[var(--radius-lg)] border border-border bg-[var(--color-panel)] p-[var(--panel-padding)] text-[var(--font-size-body)] text-[var(--color-foreground)] shadow-[var(--panel-shadow)]'
	)}
>
	{@render children?.()}
</Popover.Content>
