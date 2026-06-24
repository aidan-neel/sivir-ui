<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import { getContext, type Snippet } from 'svelte';

	const key = getContext('key');

	type Props = {
		children: Snippet;
		class: string;
	};

	let props: Props = $props();
</script>

<Popover.Content
	portal={false}
	data-ui="dropdown-submenu-content"
	class={props.class}
	surfaceClass="flex flex-col gap-0 p-[var(--menu-padding)]"
>
	{@render props.children?.()}
</Popover.Content>
