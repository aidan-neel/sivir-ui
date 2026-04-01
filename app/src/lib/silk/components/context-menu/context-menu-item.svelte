<script lang="ts">
	import { getContext } from "svelte";
	import type { ContextMenuItemProps, ContextMenuState } from ".";
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import { Button } from '$lib/silk/components/button';
	import { cn } from "$lib/silk/utils";

    const key = getContext<string>('key');
    const parent = getContext<string>('parent');
    const uiState = states[key].data as ContextMenuState;

    let { class: className, children, callback, inset = false, ...rest }: ContextMenuItemProps = $props();
</script>

<Button
	{...rest}
	onclick={() => {
		uiState.open = false;
		if (parent) {
			states[parent].data.open = false;
		}
		callback?.();
	}}
	class={cn(
		className,
		`min-h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] rounded-[var(--menu-item-radius)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] duration-150 hover:bg-[var(--menu-item-hover-bg)] hover:border-[var(--menu-item-hover-border)] hover:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_44%,transparent)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[active=true]:border-[var(--menu-item-hover-border)] data-[active=true]:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_44%,transparent)] data-[selected=true]:bg-[var(--menu-item-active-bg)] px-2 ${inset ? 'pl-8' : ''} w-full text-[14px] duration-50 hover:cursor-default items-center justify-between text-left`
	)}
	variant={'ghost'}
>
	{@render children?.()}
</Button>
