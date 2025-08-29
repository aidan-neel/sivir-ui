<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { useState } from '$lib/ui/internals/state.svelte';
	import type { Snippet } from 'svelte';

    const key = Math.random().toString(36).substring(2);
    const uiState = useState({
        open: false,
		trigger: null,
		focusedElement: null,
		buttonRef: null,
		popoverRef: null,
		placement: 'bottom',
		onclick: undefined,
        values: new Set<string>(),
        value: '',
    }, key);
    
    type Props = {
        children: Snippet;
        class: string;
        value: string;
    }

    let { class: className, children, value = $bindable(uiState.data?.value), ...rest}: Props = $props();

    $effect(() => {
        value = uiState.data?.value ?? "";
    })
</script>

<Popover.Root {...rest} state_key={key} class={className}>
    {@render children?.()}
</Popover.Root>