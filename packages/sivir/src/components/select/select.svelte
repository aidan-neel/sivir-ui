<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import { useState } from '@sivir/ui/internals/state.svelte.ts';
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
		value?: string;
	};

	let { children, value = $bindable(uiState.data?.value) }: Props = $props();
	let syncedValue = $state(value ?? '');

	// Sync the initial value prop into internal state immediately on mount.
	// Do NOT seed selectedLabel from the raw value -- it would render as the
	// slug until items mount and populate the labels Map. Leaving it empty lets
	// the trigger fall back to its children (the user's display expression).
	if (value && value !== '') {
		uiState.data.value = value;
	}

	$effect(() => {
		const nextValue = value ?? '';
		if (nextValue !== syncedValue) {
			syncedValue = nextValue;
			uiState.data.value = nextValue;
			uiState.data.selectedLabel = nextValue ? (uiState.data.labels.get(nextValue) ?? '') : '';
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

<Popover.Root bind:open={uiState.data.open} state_key={key}>
	{@render children?.()}
</Popover.Root>
