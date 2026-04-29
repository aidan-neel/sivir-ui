<script lang="ts">
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { ModalState, ModalTriggerProps } from '.';
	import { Button } from '$lib/silk/components/button';
	import { cn } from '$lib/silk/utils';

	let { class: className, children, onclick, ...rest }: ModalTriggerProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key].data as ModalState;
</script>

<Button
	aria-haspopup="dialog"
	aria-expanded={uiState.open}
	aria-controls={`modal-${key}`}
	onclick={() => {
		uiState.open = true;
		onclick?.();
	}}
	class={cn(className, ``)}
	{...rest}
>
	{@render children?.()}
</Button>
