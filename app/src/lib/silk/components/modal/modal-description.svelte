<script lang="ts">
	import { states, UIState } from '$lib/silk/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { ModalDescriptionProps, ModalState } from '.';
	import { cn } from '$lib/silk/utils';

	let { class: className, children, ...rest }: ModalDescriptionProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<ModalState>;
</script>

<p
	{...rest}
	id={uiState.key + '-desc'}
	class={cn(className, 'text-sm text-center text-foreground-muted sm:text-left')}
>
	{@render children?.()}
</p>
