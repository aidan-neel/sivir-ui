<script lang="ts">
	import { getContext } from 'svelte';
	import type { ContextMenuItemProps, ContextMenuState } from '.';
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import { Button } from '$lib/silk/components/button';
	import { cn } from '$lib/silk/utils';

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
		`min-h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] rounded-[var(--radius-lg)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] [transition-duration:var(--motion-duration-menu)] hover:bg-[var(--menu-item-hover-bg)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[selected=true]:bg-[var(--menu-item-active-bg)] px-2 ${inset ? 'pl-8' : ''} w-full text-[14px] hover:cursor-default items-center justify-between text-left`
	)}
	variant={'ghost'}
>
	{@render children?.()}
</Button>
