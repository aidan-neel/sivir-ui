<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import { useState } from '@silk/ui/internals/state.svelte.ts';
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';

	const key = Math.random().toString(36).substring(2);
	const uiState = useState(
		{
			open: false,
			trigger: null,
			focusedElement: null,
			buttonRef: null,
			popoverRef: null,
			placement: 'bottom-start',
			onclick: undefined,
			values: new Set<string>(),
			value: ''
		},
		key
	);

	type Props = {
		children: Snippet;
		class?: string;
		value?: string;
		inverted?: boolean;
	};

	let {
		class: className,
		children,
		value = $bindable(uiState.data?.value),
		inverted = false,
		...rest
	}: Props = $props();

	$effect(() => {
		setContext('inverted', inverted);
	});

	$effect(() => {
		value = uiState.data?.value ?? '';
	});
</script>

<Popover.Root placement="bottom-start" {...rest} state_key={key} class={className}>
	{@render children?.()}
</Popover.Root>
