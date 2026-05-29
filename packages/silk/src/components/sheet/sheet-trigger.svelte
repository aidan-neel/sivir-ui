<script lang="ts">
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { SheetState, SheetTriggerProps } from '.';
	import { Button } from '@silk/ui/components/button';
	import { cn } from '@silk/ui/utils';

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
	class={cn(className, ``)}
	{...rest}
>
	{@render children?.()}
</Button>
