<script lang="ts">
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { AlertDialogState } from '.';
	import { Button, type ButtonProps } from '@sivir/ui/components/button';

	let { class: className, children, onclick, ...rest }: ButtonProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key].data as AlertDialogState;
</script>

<Button
	aria-haspopup="dialog"
	aria-expanded={uiState.open}
	aria-controls={`alert-dialog-${key}`}
	onclick={() => {
		uiState.open = true;
		onclick?.();
	}}
	class={className}
	{...rest}
>
	{@render children?.()}
</Button>
