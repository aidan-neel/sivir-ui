<script lang="ts">
	import { setContext } from 'svelte';
	import type { TabsProps, TabsVariant } from '.';

	let {
		children,
		class: className,
		value = $bindable(''),
		orientation = 'horizontal',
		variant = 'default',
		...rest
	}: TabsProps = $props();

	const tabsState = $state({
		id: `tabs-${Math.random().toString(36).slice(2)}`,
		value: value ?? '',
		orientation: 'horizontal' as 'horizontal' | 'vertical',
		variant: 'default' as TabsVariant
	});

	setContext('tabs', tabsState);

	let syncedValue = $state(value ?? '');

	$effect(() => {
		tabsState.orientation = orientation;
	});

	$effect(() => {
		tabsState.variant = variant;
	});

	$effect(() => {
		const nextValue = value ?? '';
		if (nextValue !== syncedValue) {
			syncedValue = nextValue;
			tabsState.value = nextValue;
		}
	});

	$effect(() => {
		const nextValue = tabsState.value ?? '';
		if (nextValue !== syncedValue) {
			syncedValue = nextValue;
			value = nextValue;
		}
	});
</script>

<div
	class={className}
	data-ui="tabs"
	data-orientation={orientation}
	data-variant={variant}
	{...rest}
>
	{@render children?.()}
</div>
