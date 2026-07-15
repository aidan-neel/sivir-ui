<script lang="ts">
	import { states, UIState } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { ModalDescriptionProps, ModalState } from '.';
	import { cn } from '@sivir/ui/utils';

	let { class: className, children, ...rest }: ModalDescriptionProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<ModalState>;
</script>

<p
	{...rest}
	id={uiState.key + '-desc'}
	class={cn(
		className,
		'text-center [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-pretty text-foreground-muted sm:text-left'
	)}
>
	{@render children?.()}
</p>
