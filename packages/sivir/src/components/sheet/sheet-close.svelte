<script lang="ts">
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { SheetCloseProps, SheetState } from '.';
	import { Button } from '@sivir/ui/components/button';

	let { class: className, children, ...rest }: SheetCloseProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key].data as SheetState;
</script>

<Button
	variant="outline"
	onclick={() => {
		uiState.open = false;
	}}
	class={className}
	{...rest}
>
	{@render children?.()}
</Button>
