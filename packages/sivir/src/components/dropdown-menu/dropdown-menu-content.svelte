<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import { cn } from '@sivir/ui/utils';
	import { getContext, type Snippet } from 'svelte';

	const inverted = getContext('inverted') as boolean | undefined;
	const INVERTED_MENU =
		'[--color-panel:hsl(0_0%_13%)] [--panel-border:rgb(255_255_255/0.1)] [--color-foreground:hsl(0_0%_96%)] [--menu-item-foreground:hsl(0_0%_96%)] [--menu-label-foreground:hsl(0_0%_72%)] [--menu-item-hover-bg:rgb(255_255_255/0.08)] [--menu-item-active-bg:rgb(255_255_255/0.12)] [--separator-color:rgb(255_255_255/0.1)]';

	type Props = {
		children: Snippet;
		class?: string;
	};

	let props: Props = $props();
</script>

<Popover.Content
	role="menu"
	tabindex={-1}
	data-ui="dropdown-menu-content"
	class={cn(props.class, 'min-w-[var(--popover-trigger-width)] w-max', inverted && INVERTED_MENU)}
	surfaceClass="flex flex-col gap-0 p-[var(--menu-padding)]"
>
	{@render props.children?.()}
</Popover.Content>
