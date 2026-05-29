<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import type { Snippet } from 'svelte';

	type Placement = 'top' | 'left' | 'bottom' | 'right';

	let {
		children,
		delay = 600,
		closeDelay = 100,
		placement = 'top'
	}: {
		children?: Snippet;
		delay?: number;
		closeDelay?: number;
		placement?: Placement;
	} = $props();
</script>

<Popover.Root hoverable {delay} {closeDelay} {placement}>
	{@render children?.()}
</Popover.Root>
