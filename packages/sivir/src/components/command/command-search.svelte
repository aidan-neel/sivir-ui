<!-- token-lint-disable-file -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Search from '@lucide/svelte/icons/search';
	import Fuse from 'fuse.js';
	import { cn } from '@sivir/ui/utils';
	import { getCommandContext, getCommandResults } from './context.svelte';

	const command = getCommandContext();

	let element = $state<HTMLInputElement | undefined>();

	type Props = {
		threshold?: number;
	} & HTMLInputAttributes;

	const { class: classProp, threshold = 0.28, ...rest }: Props = $props();
	const fuse = $derived.by(() => {
		command.itemsVersion;
		return new Fuse(command.items, {
			keys: ['name'],
			threshold,
			ignoreLocation: true,
			minMatchCharLength: 2
		});
	});

	onMount(() => {
		if (element) {
			element.focus();
		}
	});

	function handleInput() {
		if (command.searchContent.trim() === '') {
			command.results = [...command.items];
			command.activeId = getCommandResults(command)[0]?.id;
			return;
		}

		command.results = fuse.search(command.searchContent).map((result) => result.item);
		command.activeId = getCommandResults(command)[0]?.id;
	}

	function setActive(index: number) {
		const results = getCommandResults(command);
		if (results.length === 0) return;

		const item = results[(index + results.length) % results.length];
		command.activeId = item.id;
		item.ref?.scrollIntoView?.({ block: 'nearest' });
	}

	function handleKeydown(event: KeyboardEvent) {
		const results = getCommandResults(command);
		const activeIndex = results.findIndex((item) => item.id === command.activeId);

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				setActive(activeIndex + 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				setActive(activeIndex <= 0 ? results.length - 1 : activeIndex - 1);
				break;
			case 'Home':
				event.preventDefault();
				setActive(0);
				break;
			case 'End':
				event.preventDefault();
				setActive(results.length - 1);
				break;
			case 'Enter': {
				const active = results.find((item) => item.id === command.activeId) ?? results[0];
				if (!active) return;
				event.preventDefault();
				active.ref?.click();
				break;
			}
		}
	}
</script>

<div class="flex w-full items-center gap-2.5 border-b border-border px-3.5 py-3">
	<Search size={16} class="shrink-0 text-foreground-muted" />
	<input
		bind:this={element}
		bind:value={command.searchContent}
		oninput={handleInput}
		onkeydown={handleKeydown}
		class={cn(
			classProp,
			'w-full bg-transparent text-[0.9rem] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground placeholder:text-foreground-muted focus-visible:outline-none'
		)}
		placeholder="Type a command or search..."
		aria-label="Search commands"
		role="combobox"
		aria-autocomplete="list"
		aria-expanded="true"
		aria-controls={`${command.id}-listbox`}
		aria-activedescendant={command.activeId}
		{...rest}
	/>
</div>
