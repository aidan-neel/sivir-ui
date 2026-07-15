<script lang="ts">
	import { type Snippet } from 'svelte';
	import * as Popover from '@sivir/ui/components/popover';
	import { getPopoverContext } from '@sivir/ui/components/popover/context.svelte';
	import { getDropdownMenuContext, setDropdownMenuContext } from './context.svelte';

	const { state: parentState } = getPopoverContext();
	const { inverted } = getDropdownMenuContext();
	setDropdownMenuContext({ inverted, parentState });

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();
</script>

<Popover.Root hoverable={true} placement="right">
	{@render children?.()}
</Popover.Root>
