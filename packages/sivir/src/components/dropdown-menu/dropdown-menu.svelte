<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import { useState } from '@sivir/ui/internals/state.svelte.ts';
	import { setContext, untrack } from 'svelte';
	import type { Snippet } from 'svelte';

	const key = Math.random().toString(36).substring(2);
	useState(
		{
			open: false,
			trigger: null,
			focusedElement: null,
			buttonRef: null,
			popoverRef: null,
			placement: 'bottom-start',
			onclick: undefined
		},
		key
	);

	type Props = {
		children: Snippet;
		inverted?: boolean;
	};

	let { children, inverted = false }: Props = $props();

	// Must run during init: Content reads this via getContext() while it
	// initializes, which happens before any $effect fires. Setting it in an
	// effect leaves Content with `undefined` and the inverted theme never applies.
	setContext(
		'inverted',
		untrack(() => inverted)
	);
</script>

<Popover.Root placement="bottom-start" state_key={key}>
	{@render children?.()}
</Popover.Root>
