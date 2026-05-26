<script lang="ts">
	import { getContext } from 'svelte';
	import { states, UIState } from '$lib/silk/internals/state.svelte.ts';
	import { themedSlide } from '$lib/silk/internals/transition';
	import { cn } from '$lib/silk/utils';
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
