<script lang="ts">
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { ModalState, ModalTriggerProps } from '.';
	import { Button } from '@sivir/ui/components/button';

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
	class={className}
	{...rest}
>
	{@render children?.()}
</Button>
