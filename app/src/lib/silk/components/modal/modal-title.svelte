<script lang="ts">
	import { states, UIState } from '$lib/silk/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { ModalState, ModalTitleProps } from '.';
	import { cn } from '$lib/silk/utils';

	let { class: className, children, ...rest }: ModalTitleProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<ModalState>;
</script>

<h1
	{...rest}
	id={uiState.key + '-title'}
	class={cn(className, 'text-lg text-center [font-weight:var(--font-weight-header,600)] tracking-[-0.02em] sm:text-left')}
>
	{@render children?.()}
</h1>
