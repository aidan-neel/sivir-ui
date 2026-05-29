<script lang="ts">
	import { getContext } from 'svelte';
	import { states, UIState } from '@silk/ui/internals/state.svelte.ts';
	import { cn } from '@silk/ui/utils';
	import type { CollapsibleTriggerProps, CollapsibleState } from '.';

	let { class: className, children, ...rest }: CollapsibleTriggerProps = $props();
	const key = getContext<string>('key');
	const uiState = states[key] as UIState<CollapsibleState>;
</script>

<button
	type="button"
	data-ui="collapsible-trigger"
	data-state={uiState.data.open ? 'open' : 'closed'}
	aria-expanded={uiState.data.open}
	aria-controls={`collapsible-${key}`}
	disabled={uiState.data.disabled}
	onclick={() => (uiState.data.open = !uiState.data.open)}
	class={cn('inline-flex items-center gap-2', className)}
	{...rest}
>
	{@render children?.()}
</button>
