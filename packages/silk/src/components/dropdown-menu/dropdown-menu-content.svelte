<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import { cn } from '@silk/ui/utils';
	import { getContext, type Snippet } from 'svelte';

	const key = getContext('key');
	const inverted = getContext('inverted') as boolean | undefined;

	type Props = {
		children: Snippet;
		class?: string;
	};

	let props: Props = $props();

	const invertedStyles = inverted
		? {
				'--color-panel': 'hsl(0 0% 13%)',
				'--color-panel-foreground': 'hsl(0 0% 96%)',
				'--menu-item-foreground': 'hsl(0 0% 96%)',
				'--menu-label-foreground': 'hsl(0 0% 72%)',
				'--menu-item-hover-bg': 'rgb(255 255 255 / 0.08)',
				'--menu-item-active-bg': 'rgb(255 255 255 / 0.12)',
				'--separator-color': 'rgb(255 255 255 / 0.1)'
			}
		: {};
</script>

<Popover.Content
	role="menu"
	tabindex={-1}
	data-ui="dropdown-menu-content"
	style={inverted
		? Object.entries(invertedStyles)
				.map(([key, value]) => `${key}: ${value}`)
				.join('; ')
		: undefined}
	class={cn(
		props.class,
		'min-w-[var(--popover-trigger-width)] w-max bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[var(--panel-shadow)] p-[var(--menu-padding)] flex flex-col gap-0'
	)}
>
	{@render props.children?.()}
</Popover.Content>
