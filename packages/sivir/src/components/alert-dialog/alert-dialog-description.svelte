<script lang="ts">
	import { states, type UIState } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import type { AlertDialogState } from '.';
	import { cn, type DefaultProps } from '@sivir/ui/utils';

	let { class: className, children, ...rest }: DefaultProps = $props();

	const key = getContext<string>('key');
	const uiState = states[key] as UIState<AlertDialogState>;
</script>

<p
	{...rest}
	id={uiState.key + '-desc'}
	class={cn(
		className,
		'text-center [font-size:var(--font-size-body,16px)] font-medium [letter-spacing:var(--tracking-body,0em)] text-pretty text-foreground-muted sm:text-left'
	)}
>
	{@render children?.()}
</p>
