<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import type { Snippet } from 'svelte';
	import type { CommandState } from '.';
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';

	const key = getContext('key') as string;
	const uiState = states[key].data as CommandState;

	type Props = {
		children: Snippet;
		class?: string;
		heading: string;
	};

	let { children, class: className, heading, ...rest }: Props = $props();
</script>

<div {...rest} class="flex flex-col px-[var(--menu-padding)] pt-[var(--menu-padding)]">
	{#if uiState.searchContent === ''}
		<p
			class={cn(
				className,
				'text-[length:var(--text-xs)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-[var(--menu-label-foreground)] select-none px-[var(--menu-label-padding-x)] py-[var(--menu-label-padding-y)]'
			)}
		>
			{heading}
		</p>
	{/if}

	{@render children?.()}
</div>
