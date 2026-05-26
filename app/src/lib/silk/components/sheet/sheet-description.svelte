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

<p
	{...rest}
	id={uiState.key + '-desc'}
	class={cn(className, 'text-sm [font-weight:var(--font-weight-body,400)] text-foreground-muted')}
>
	{@render children?.()}
</p>
