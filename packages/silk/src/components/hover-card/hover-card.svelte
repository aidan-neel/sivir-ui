<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import type { HoverCardProps } from '.';

	let {
		open = $bindable(false),
		openDelay = 200,
		closeDelay = 150,
		children
	}: HoverCardProps = $props();
</script>

<Popover.Root bind:open hoverable delay={openDelay} {closeDelay}>
	{@render children?.()}
</Popover.Root>
