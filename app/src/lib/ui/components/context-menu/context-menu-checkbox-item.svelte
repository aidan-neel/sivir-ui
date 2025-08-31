<script lang="ts">
	import { getContext, onMount, tick } from "svelte";
	import { type ContextMenuCheckboxItemProps, type ContextMenuState } from ".";
	import { states } from "$lib/ui/internals/state.svelte";
    import { Button } from '$lib/ui/components/button';
	import { cn } from "$lib/ui/utils";
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
	class={cn(className, `px-2 pl-8 relative hover:bg-muted/50 w-full h-9 font-normal duration-100 rounded-lg hover:cursor-default text-sm items-center justify-between text-left`)}
	variant="ghost"
>
	<div class="w-4 h-4 absolute left-2">
		{#if checkboxItem?.checked}
			<Check class="text-foreground" />
		{/if}
	</div>
	{@render children?.()}
</Button>
