<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { CommandState } from '.';
	import { states } from '@sivir/ui/internals/state.svelte.ts';

	const key = getContext('key') as string;
	const uiState = states[key].data as CommandState;

	type Props = {
		children?: Snippet;
		class?: string;
	};

	let { children, class: className, ...rest }: Props = $props();
</script>

{#if uiState.searchContent === ''}
	<div
		{...rest}
		data-ui="menu-separator"
		class={cn(
			className,
			'bg-[var(--separator-color)] rounded-[var(--radius-xl)] h-[var(--border-size)] w-[calc(100%-2*var(--command-dialog-width-margin))] mx-auto my-1'
		)}
	>
		{@render children?.()}
	</div>
{/if}
