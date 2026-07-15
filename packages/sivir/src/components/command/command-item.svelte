<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { cn } from '@sivir/ui/utils';
	import { getContext, onMount, type Snippet } from 'svelte';
	import type { CommandItem, CommandState } from '.';
	import { MENU_ITEM } from '@sivir/ui/internals/menu';

	const key = getContext('key') as string;
	const uiState = states[key].data as CommandState;

	type Props = {
		class?: string;
		name: string;
		children?: Snippet;
		callback?: () => void;
	} & ButtonProps;

	let { children, name, class: className, callback, ...rest }: Props = $props();
	let el = $state<HTMLButtonElement | HTMLAnchorElement | undefined>();
	const item = {
		get name() {
			return name;
		},
		get callback() {
			return callback;
		},
		get ref() {
			return el;
		}
	} as CommandItem;

	onMount(() => {
		uiState.items.add(item);
		uiState.results = new Set(uiState.items);

		return () => {
			uiState.items.delete(item);
			uiState.results.delete(item);
		};
	});
</script>

<Button
	role="menuitem"
	bind:element={el}
	{...rest}
	onclick={() => {
		uiState.open = false;
		uiState.searchContent = '';
		callback?.();
	}}
	class={cn(
		className,
		`${MENU_ITEM} justify-start gap-2`,
		uiState.searchContent !== '' &&
			!Array.from(uiState.results).some((result) => result.name === item.name) &&
			'hidden'
	)}
	variant="ghost"
>
	<div class="flex w-full items-center gap-2 text-left">
		{@render children?.()}
	</div>
</Button>
