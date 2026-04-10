<script lang="ts">
	import * as Popover from '$lib/silk/components/popover';
	import { useState } from '$lib/silk/internals/state.svelte.ts';
	import type { Snippet } from 'svelte';

	const key = Math.random().toString(36).substring(2);
	const uiState = useState(
		{
			open: false,
			trigger: null,
			focusedElement: null,
			buttonRef: null,
			popoverRef: null,
			placement: 'bottom',
			onclick: undefined,
			closeTimeout: undefined,
			hoverable: false,
			hovering: false,
			delay: 0,
			closeDelay: 150,
			values: new Set<string>(),
			labels: new Map<string, string>(),
			value: '',
			selectedLabel: ''
		},
		key
	);

	type Props = {
		children: Snippet;
		class: string;
		value: string;
	};

	let {
		class: className,
		children,
		value = $bindable(uiState.data?.value),
		...rest
	}: Props = $props();
	let syncedValue = $state(value ?? '');

	// Sync the initial value prop into internal state immediately on mount
	if (value && value !== '') {
		uiState.data.value = value;
		uiState.data.selectedLabel = value;
	}

	$effect(() => {
		const nextValue = value ?? '';
		if (nextValue !== syncedValue) {
			syncedValue = nextValue;
			uiState.data.value = nextValue;
			uiState.data.selectedLabel = nextValue
				? (uiState.data.labels.get(nextValue) ?? nextValue)
				: '';
		}
	});

	$effect(() => {
		const nextValue = uiState.data?.value ?? '';
		if (nextValue !== syncedValue) {
			syncedValue = nextValue;
			value = nextValue;
		}
	});
</script>

<Popover.Root {...rest} bind:open={uiState.data.open} state_key={key} class={className}>
	{@render children?.()}
</Popover.Root>
