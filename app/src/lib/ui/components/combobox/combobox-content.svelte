<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '$lib/ui/components/button';
	import { computePosition, flip } from '@floating-ui/dom';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { states } from '$lib/ui/internals/state.svelte';
	import type { ComboboxState } from '.';
	import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';

	const key = getContext("key") as string;
	const uiState = states[key].data as ComboboxState;

	let element: HTMLButtonElement | undefined = $state();
    let lastOpen = $state<boolean>(uiState.open);
	const { children, class: className, ...rest }: Popover.PopoverContentProps = $props();
</script>

<Popover.Content {...rest} class={cn(className, 'p-0 overflow-y-auto')}>
    {@render children?.()}
</Popover.Content>