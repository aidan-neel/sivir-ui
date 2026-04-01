<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import type { CommandItem, CommandState } from '.';
	import Search from '@lucide/svelte/icons/search';
	import Fuse from 'fuse.js';

	const key = getContext('key') as string;
	const uiState = states[key].data as CommandState;

	let element = $state<HTMLInputElement | undefined>();

	type Props = {
		children?: Snippet;
		class?: string;
		threshold?: number;
	};

	const { children, class: classProp, threshold = 0.5, ...rest }: Props = $props();

	onMount(() => {
		if (element) {
			element.focus();
		}
	});

	function handleInput() {
		const itemsArray = Array.from(uiState.items);

		if (uiState.searchContent.trim() === '') {
			uiState.results = new Set(itemsArray);
			return;
		}

		const namesArray = itemsArray.map((item) => item.name);
		const fuse = new Fuse(namesArray, { threshold });
		const results = fuse.search(uiState.searchContent);

		const resultSet = new Set<CommandItem>(
			results
				.map((r) => itemsArray.find((item) => item.name === r.item))
				.filter(Boolean) as CommandItem[]
		);

		uiState.results = resultSet;
	}
</script>

<div class="flex w-full items-center gap-2 border-b border-border/70 p-3">
	<Search size={18} class="mt-0.5 text-foreground-muted" />
	<input
		bind:this={element}
		bind:value={uiState.searchContent}
		oninput={handleInput}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				const firstResult =
					uiState.searchContent.trim() === ''
						? Array.from(uiState.items)[0]
						: Array.from(uiState.results)[0];
				if (firstResult) {
					uiState.open = false;
					uiState.searchContent = '';
					firstResult.callback?.();
				}
			}
		}}
		class="w-full bg-transparent text-sm font-medium placeholder:text-foreground-muted focus-visible:outline-none"
		placeholder="Type a command or search..."
		aria-label="Search commands"
		{...rest}
	/>
</div>
