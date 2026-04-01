<script lang="ts">
	import { getContext, onMount, tick } from "svelte";
	import { type ContextMenuCheckboxItemProps, type ContextMenuState } from ".";
	import { states } from '$lib/silk/internals/state.svelte.ts';
	import { Button } from '$lib/silk/components/button';
	import { cn } from "$lib/silk/utils";
	import Check from "@lucide/svelte/icons/check";

	const key = getContext<string>('key');
    const parent = getContext<string>('parent');
	const uiState = states[key].data as ContextMenuState;

	let { class: className, children, value, callback, inset = false, ...rest }: ContextMenuCheckboxItemProps = $props();

	// ensure checkboxItem exists
	let checkboxItem = $state(Array.from(uiState.checkboxItems).find(ci => ci.value === value));
	// svelte-ignore state_referenced_locally
		if (!checkboxItem) {
		checkboxItem = { value, checked: false }; // must satisfy type
		// svelte-ignore state_referenced_locally
        uiState.checkboxItems.add(checkboxItem);
	}

	async function toggle() {
		if (!checkboxItem) return; // safety check
        checkboxItem.checked = !checkboxItem.checked;
		setTimeout(() => {
            uiState.open = false;
        }, 1)
        if (parent) {
            states[parent].data.open = false;
        }
		callback?.();
	}
</script>

<Button
	{...rest}
	onclick={toggle}
	class={cn(
		className,
		`min-h-[var(--menu-item-height)] px-[var(--menu-item-padding-x)] rounded-[var(--menu-item-radius)] text-[var(--menu-item-foreground)] border border-transparent transition-[background-color,border-color,color,box-shadow] duration-150 hover:bg-[var(--menu-item-hover-bg)] hover:border-[var(--menu-item-hover-border)] hover:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_44%,transparent)] data-[active=true]:bg-[var(--menu-item-hover-bg)] data-[active=true]:border-[var(--menu-item-hover-border)] data-[active=true]:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_44%,transparent)] data-[selected=true]:bg-[var(--menu-item-active-bg)] px-2 pl-8 relative w-full text-[14px] duration-50 hover:cursor-default items-center justify-between text-left`
	)}
	variant="ghost"
>
	<div class="w-4 h-4 absolute left-2">
		{#if checkboxItem?.checked}
			<Check class="text-foreground" />
		{/if}
	</div>
	{@render children?.()}
</Button>
