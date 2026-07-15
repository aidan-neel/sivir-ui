<script lang="ts">
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { SheetState, SheetTriggerProps } from '.';
	import { Button } from '@sivir/ui/components/button';

	let { class: className, children, ...rest }: SheetTriggerProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key].data as SheetState;
</script>

<Button
	aria-haspopup="dialog"
	aria-expanded={uiState.open}
	aria-controls={`sheet-${key}`}
	onclick={() => {
		uiState.open = !uiState.open;
	}}
	class={className}
	{...rest}
>
	{@render children?.()}
</Button>
