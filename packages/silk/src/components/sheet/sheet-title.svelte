<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import { states, type UIState } from '@silk/ui/internals/state.svelte.ts';
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
		`[font-family:var(--font-header)] [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]`
	)}
>
	{@render children?.()}
</h1>
