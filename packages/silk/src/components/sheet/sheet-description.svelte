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

<p
	{...rest}
	id={uiState.key + '-desc'}
	class={cn(className, '[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted')}
>
	{@render children?.()}
</p>
