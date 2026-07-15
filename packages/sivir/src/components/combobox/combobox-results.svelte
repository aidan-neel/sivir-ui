<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import type { ComboboxState } from '.';

	const key = getContext('key') as string;
	const uiState = states[key].data as ComboboxState;

	type Props = {
		children?: Snippet;
	};

	const { children }: Props = $props();
</script>

<div
	role="listbox"
	id={`combobox-${String(key)}-listbox`}
	class="flex max-h-full flex-col gap-0 overflow-y-auto p-1"
>
	{#if uiState.searchContent === ''}
		{@render children?.()}
	{:else if uiState.results.size > 0}
		{@render children?.()}
	{:else}
		<div class="flex w-full items-center justify-center p-3">
			<p
				class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
			>
				No results found
			</p>
		</div>
	{/if}
</div>
