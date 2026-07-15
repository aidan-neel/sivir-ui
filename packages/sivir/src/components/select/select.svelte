<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import type { Snippet } from 'svelte';
	import { setSelectContext } from './context.svelte';

	const key = $props.id();

	type Props = {
		children: Snippet;
		value?: string;
	};

	let { children, value = $bindable('') }: Props = $props();
	const selectState = $state({
		open: false,
		values: new Set<string>(),
		labels: new Map<string, string>(),
		value: value ?? '',
		selectedLabel: ''
	});
	let syncedValue = $state(value ?? '');
	setSelectContext({ id: key, state: selectState });

	// Sync the initial value prop into internal state immediately on mount.
	// Do NOT seed selectedLabel from the raw value -- it would render as the
	// slug until items mount and populate the labels Map. Leaving it empty lets
	// the trigger fall back to its children (the user's display expression).
	if (value && value !== '') {
		selectState.value = value;
	}

	$effect(() => {
		const nextValue = value ?? '';
		if (nextValue !== syncedValue) {
			syncedValue = nextValue;
			selectState.value = nextValue;
			selectState.selectedLabel = nextValue ? (selectState.labels.get(nextValue) ?? '') : '';
		}
	});

	$effect(() => {
		const nextValue = selectState.value;
		if (nextValue !== syncedValue) {
			syncedValue = nextValue;
			value = nextValue;
		}
	});
</script>

<Popover.Root bind:open={selectState.open} state_key={key}>
	{@render children?.()}
</Popover.Root>
