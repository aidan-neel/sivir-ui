<script lang="ts">
	import { Button, type ButtonProps } from '@silk/ui/components/button';
	import { states, type UIState } from '@silk/ui/internals/state.svelte.ts';
	import { cn } from '@silk/ui/utils';
	import { getContext, setContext, type Snippet } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import { flyAndScale } from '@silk/ui/internals/transition';
	import type { PopoverState } from '@silk/ui/components/popover';

	const key = getContext('key') as string;
	const parent = getContext('parent') as string;
	const uiState = states[key] as UIState<PopoverState>;

	type Props = {
		class?: string;
		children?: Snippet;
		callback?: () => void;
	} & ButtonProps;

	let { children, class: className, callback, onclick: userOnclick, ...rest }: Props = $props();
</script>

<Button
	role="menuitem"
	{...rest}
	onclick={() => {
		uiState.data.open = false;
		setTimeout(() => {
			if (parent) {
				(states[parent].data as PopoverState).open = false;
			}
		}, 100);
		callback?.();
		userOnclick?.();
	}}
	class={cn(
		className,
		'[--button-height:var(--menu-item-height)] h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] py-0 rounded-[var(--radius-lg)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] [transition-duration:var(--motion-duration-menu)] ease-[var(--ease-out)] hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] w-full text-sm hover:cursor-default flex-row items-center justify-between gap-3 text-left'
	)}
	variant={'ghost'}
>
	{@render children?.()}
</Button>
