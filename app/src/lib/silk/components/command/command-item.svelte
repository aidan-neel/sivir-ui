<script lang="ts">
	import { Button, type ButtonProps } from '$lib/silk/components/button';
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import { cn } from '$lib/silk/utils';
	import { getContext, onMount, type Snippet } from 'svelte';
	import type { CommandItem, CommandState } from '.';

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

{#if uiState.searchContent === ''}
	<Button
		bind:element={el}
		{...rest}
		onclick={() => {
			uiState.open = false;
			uiState.searchContent = '';
			callback?.();
		}}
		class={cn(
			className,
			'[--button-height:var(--menu-item-height)] h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] py-0 rounded-[var(--radius-lg)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] [transition-duration:var(--motion-duration-menu)] hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] w-full justify-start gap-2 text-left'
		)}
		variant="ghost"
	>
		{@render children?.()}
	</Button>
{:else}
	<Button
		bind:element={el}
		{...rest}
		onclick={() => {
			uiState.open = false;
			uiState.searchContent = '';
			callback?.();
		}}
		class={cn(
			className,
			'[--button-height:var(--menu-item-height)] h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] py-0 rounded-[var(--radius-lg)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] [transition-duration:var(--motion-duration-menu)] hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] w-full justify-start gap-2 text-left',
			!Array.from(uiState.results).some((r) => r.name === item.name) && 'hidden'
		)}
		variant="ghost"
	>
		{@render children?.()}
	</Button>
{/if}
