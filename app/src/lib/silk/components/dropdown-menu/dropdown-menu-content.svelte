<script lang="ts">
	import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';
	import { getContext, type Snippet } from 'svelte';

	const key = getContext('key');

	type Props = {
		children: Snippet;
		class: string;
	};

	let props: Props = $props();
</script>

<Popover.Content
	role="menu"
	tabindex={-1}
	data-ui="dropdown-menu-content"
	class={cn(
		props.class,
		'min-w-[var(--popover-trigger-width)] w-max bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-outlined p-1.5 flex flex-col gap-0.5'
	)}
>
	{@render props.children?.()}
</Popover.Content>
