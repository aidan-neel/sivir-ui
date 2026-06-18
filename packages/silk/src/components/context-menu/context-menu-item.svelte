<script lang="ts">
	import { getContext } from 'svelte';
	import type { ContextMenuItemProps, ContextMenuState } from '.';
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { Button } from '@silk/ui/components/button';
	import { cn } from '@silk/ui/utils';

	const key = getContext<string>('key');
	const parent = getContext<string>('parent');
	const uiState = states[key].data as ContextMenuState;

	let {
		class: className,
		children,
		callback,
		inset = false,
		...rest
	}: ContextMenuItemProps = $props();
</script>

<Button
	role="menuitem"
	{...rest}
	onclick={() => {
		uiState.open = false;
		if (parent) {
			(states[parent].data as ContextMenuState).open = false;
		}
		callback?.();
	}}
	class={cn(
		className,
		`[--button-height:var(--menu-item-height)] h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] py-0 rounded-[var(--radius-md)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] [transition-duration:var(--motion-duration-menu)] hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] ${inset ? 'pl-8' : ''} w-full text-[14px] hover:cursor-default items-center justify-between text-left`
	)}
	variant={'ghost'}
>
	{@render children?.()}
</Button>
