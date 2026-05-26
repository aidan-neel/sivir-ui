<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '$lib/silk/components/button';
	import { computePosition, flip } from '@floating-ui/dom';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import type { ComboboxState } from '.';
	import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';

	const key = getContext('key') as string;
	const uiState = states[key].data as ComboboxState;

	let element: HTMLButtonElement | undefined = $state();
	let lastOpen = $state<boolean>(uiState.open);
	const { children, class: className, ...rest }: Popover.PopoverContentProps = $props();
</script>

<Popover.Content
	{...rest}
	role="listbox"
	tabindex={-1}
	data-ui="combobox-content"
	class={cn(
		className,
		'bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-border rounded-[var(--radius-lg)] shadow-[var(--panel-shadow)] p-0 overflow-y-auto'
	)}
>
	{@render children?.()}
</Popover.Content>
