<script lang="ts">
	import { setContext } from 'svelte';
	import type { TabsProps } from '.';

	let {
		children,
		class: className,
		value = $bindable(''),
		orientation = 'horizontal',
		...rest
	}: TabsProps = $props();

	const tabsState = $state({
		id: `tabs-${Math.random().toString(36).slice(2)}`,
		value: value ?? '',
		orientation: 'horizontal' as 'horizontal' | 'vertical'
	});

	setContext('tabs', tabsState);

	let syncedValue = $state(value ?? '');

	$effect(() => {
		tabsState.orientation = orientation;
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

<div class={className} data-ui="tabs" data-orientation={orientation} {...rest}>
	{@render children?.()}
</div>
