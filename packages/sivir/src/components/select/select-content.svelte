<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import { states, type UIState } from '@sivir/ui/internals/state.svelte.ts';
	import { cn } from '@sivir/ui/utils';
	import { getContext, tick, type Snippet } from 'svelte';
	import type { SelectState } from '.';

	const key = getContext('key') as string;
	const uiState = states[key] as UIState<SelectState>;

	type Props = {
		children: Snippet;
		class?: string;
	};

	let props: Props = $props();

	$effect(() => {
		if (!uiState.data.open) return;

		void tick().then(() => {
			const content = uiState.data.popoverRef as HTMLElement | undefined;
			if (!content) return;

			const selected =
				content.querySelector<HTMLElement>('[role="option"][aria-selected="true"]') ??
				content.querySelector<HTMLElement>('[role="option"]');
			selected?.focus();
		});
	});
</script>

<Popover.Content
	role="listbox"
	tabindex={-1}
	data-ui="select-content"
	class={cn(props.class, 'min-w-[var(--popover-trigger-width)] w-max')}
	surfaceClass="flex flex-col gap-0 p-[var(--menu-padding)]"
>
	{@render props.children?.()}
</Popover.Content>
