<script lang="ts">
	import { getContext } from 'svelte';
	import { states, UIState } from '@silk/ui/internals/state.svelte.ts';
	import { themedSlide } from '@silk/ui/internals/transition';
	import { cn } from '@silk/ui/utils';
	import type { CollapsibleContentProps, CollapsibleState } from '.';

	let { class: className, children, ...rest }: CollapsibleContentProps = $props();
	const key = getContext<string>('key');
	const uiState = states[key] as UIState<CollapsibleState>;
</script>

{#if uiState.data.open}
	<div
		id={`collapsible-${key}`}
		data-ui="collapsible-content"
		data-state="open"
		transition:themedSlide={{ durationVar: '--motion-duration-panel', fallback: 220 }}
		class={cn('overflow-hidden', className)}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
