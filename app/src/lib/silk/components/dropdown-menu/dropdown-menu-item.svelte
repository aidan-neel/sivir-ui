<script lang="ts">
	import { Button, type ButtonProps } from '$lib/silk/components/button';
	import { states, type UIState } from '$lib/silk/internals/state.svelte.ts';
	import { cn } from '$lib/silk/utils';
	import { getContext, setContext, type Snippet } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import { flyAndScale } from '$lib/silk/internals/transition';
	import type { PopoverState } from '$lib/silk/components/popover';

	const key = getContext('key') as string;
	const parent = getContext('parent') as string;
	const uiState = states[key] as UIState<PopoverState>;

	type Props = {
		class: string;
		children?: Snippet;
		callback?: () => void;
	} & ButtonProps;

	let { children, class: className, callback, ...rest }: Props = $props();
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
	}}
	class={cn(
		className,
		'min-h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] rounded-[var(--menu-item-radius)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] duration-150 hover:bg-[var(--menu-item-hover-bg)] hover:border-border hover:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_44%,transparent)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[active=true]:border-border data-[active=true]:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_44%,transparent)] data-[selected=true]:bg-[var(--menu-item-active-bg)] w-full text-[14px] duration-50 hover:cursor-default items-center justify-between text-left'
	)}
	variant={'ghost'}
>
	{@render children?.()}
</Button>
