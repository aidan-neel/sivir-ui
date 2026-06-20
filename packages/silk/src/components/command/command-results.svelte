<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import type { CommandState } from '.';

	const key = getContext('key') as string;
	const uiState = states[key].data as CommandState;

	type Props = {
		children?: Snippet;
		class?: string;
		allowClickOutside?: boolean;
	};

	const { children, class: className, allowClickOutside = true, ...rest }: Props = $props();
</script>

<div class="max-h-full overflow-y-auto p-[var(--menu-padding)]">
	{#if uiState.searchContent === '' || uiState.results.size > 0}
		{@render children?.()}
	{:else}
		<div class="flex w-full items-center justify-center p-[var(--panel-padding)]">
			<p class="text-sm text-foreground-muted">No results found</p>
		</div>
	{/if}
</div>
