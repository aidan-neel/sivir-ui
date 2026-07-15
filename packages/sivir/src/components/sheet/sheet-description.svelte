<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import { states, type UIState } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { SheetDescriptionProps, SheetState } from '.';

	let { class: className, children, ...rest }: SheetDescriptionProps = $props();
	const key = getContext<string>('key');
	const uiState = states[key] as UIState<SheetState>;
</script>

<p
	{...rest}
	id={uiState.key + '-desc'}
	class={cn(
		className,
		'[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-pretty text-foreground-muted'
	)}
>
	{@render children?.()}
</p>
