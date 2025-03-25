<script lang="ts">
	import { cn } from '$lib/ui/utils';
	import { type Snippet } from 'svelte';
	import { Button } from '$lib/ui/components/button';
	import { getModalUIState, type ModalUIState } from './lib.svelte';
	import type { UIState } from '$lib/ui/internals/state.svelte';

	let {
		children,
		class: classProp,
		variant,
		closeOnConfirm = true,
		callback,
		...rest
	}: {
		children: Snippet;
		class?: string;
		variant?: any;
		closeOnConfirm?: boolean;
		callback?: () => any;
	} = $props();

	const uiState: UIState<ModalUIState> = getModalUIState();
</script>

<Button
	onclick={() => {
		callback?.();
		if (closeOnConfirm) {
			uiState.data.open = false;
		}
	}}
	{...rest}
	role="button"
	variant={variant || 'primary'}
	class={cn(classProp, `text-sm`)}
>
	{@render children?.()}
</Button>
