<script lang="ts">
	import { states, UIState } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { ModalState, ModalTitleProps } from '.';
	import { cn } from '@sivir/ui/utils';

	let { class: className, children, ...rest }: ModalTitleProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<ModalState>;
</script>

<h1
	{...rest}
	id={uiState.key + '-title'}
	class={cn(
		className,
		'text-center [font-family:var(--font-header)] [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)] text-balance sm:text-left'
	)}
>
	{@render children?.()}
</h1>
