<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Button, type ButtonProps } from '@silk/ui/components/button';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import type { ComboboxState } from '.';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { clickOutside, cn } from '@silk/ui/utils';

	const key = getContext('key') as string;
	const uiState = states[key].data as ComboboxState;

	type Props = {
		children?: Snippet;
		class?: string;
		allowClickOutside?: boolean;
	};

	const { children, class: className, allowClickOutside = true, ...rest }: Props = $props();
</script>

<div
	role="listbox"
	id={`combobox-${String(key)}-listbox`}
	class="overflow-y-auto max-h-full p-[var(--menu-padding)] flex flex-col gap-0"
>
	{#if uiState.searchContent === ''}
		{@render children?.()}
	{:else if uiState.results.size > 0}
		{@render children?.()}
	{:else}
		<div class="w-full p-3 flex items-center justify-center">
			<p
				class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
			>
				No results found
			</p>
		</div>
	{/if}
</div>
