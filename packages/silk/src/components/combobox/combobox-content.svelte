<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '@silk/ui/components/button';
	import { computePosition, flip } from '@floating-ui/dom';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import type { ComboboxState } from '.';
	import * as Popover from '@silk/ui/components/popover';
	import { cn } from '@silk/ui/utils';

	const key = getContext('key') as string;
	const uiState = states[key].data as ComboboxState;

	let element: HTMLButtonElement | undefined = $state();
	let lastOpen = $state<boolean>(uiState.open);
	const { children, class: className, ...rest }: Popover.PopoverContentProps = $props();
</script>

<Popover.Content
	{...rest}
	role="none"
	tabindex={-1}
	focusTrap={false}
	data-ui="combobox-content"
	class={cn(
		className,
		'min-w-[var(--popover-trigger-width)] w-[var(--popover-trigger-width)] bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[var(--panel-shadow)] p-[var(--menu-padding)] overflow-y-auto'
	)}
>
	{@render children?.()}
</Popover.Content>
