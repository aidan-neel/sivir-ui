<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import * as Popover from '@sivir/ui/components/popover';
	import type { ContextMenuSubProps } from '.';

	const key = Math.random().toString(36).substring(2);
	setContext('parent', getContext('key'));

	let { children }: ContextMenuSubProps = $props();
</script>

<Popover.Root state_key={key} hoverable={true} placement="right">
	{@render children?.()}
</Popover.Root>
