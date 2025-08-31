<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { useState } from '$lib/ui/internals/state.svelte';
	import type { ContextMenuProps, ContextMenuState } from '.';

    const key = Math.random().toString(36).substring(2);
    useState<ContextMenuState>({
        open: false,
		trigger: null,
		focusedElement: null,
		buttonRef: null,
		popoverRef: undefined,
		placement: 'bottom',
		onclick: undefined,
        checkboxItems: new Set()
    } as ContextMenuState, key);

    let { class: className, children, ...rest }: ContextMenuProps = $props();
</script>

<Popover.Root {...rest} state_key={key} class={className}>
    {@render children?.()}
</Popover.Root>