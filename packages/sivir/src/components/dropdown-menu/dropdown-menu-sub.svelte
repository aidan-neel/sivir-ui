<script lang="ts">
	import { getContext, setContext, type Snippet } from 'svelte';
	import * as Popover from '@sivir/ui/components/popover';

	const key = Math.random().toString(36).substring(2);
	setContext('parent', getContext('key'));

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();
</script>

<Popover.Root state_key={key} hoverable={true} placement="right">
	{@render children?.()}
</Popover.Root>
