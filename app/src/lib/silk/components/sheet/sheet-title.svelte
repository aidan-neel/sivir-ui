<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import { states, type UIState } from '$lib/silk/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { SheetState } from '.';
	import type { SheetTitleProps } from '.';

	let { class: className, children, ...rest }: SheetTitleProps = $props();
	const key = getContext<string>('key');
	const uiState = states[key] as UIState<SheetState>;
</script>

<h1
	{...rest}
	id={uiState.key + '-title'}
	class={cn(
		className,
		`text-lg [font-weight:var(--font-weight-header,600)] tracking-[-0.02em]`
	)}
>
	{@render children?.()}
</h1>
