<script lang="ts">
	import { useState } from "$lib/ui/internals/state.svelte";
	import { setContext } from "svelte";
	import type { DialogState, DialogProps } from ".";
    
    let { open = $bindable(false), class: className, children }: DialogProps = $props();
    
    const uiState = useState<DialogState>({
        open: open
    })

    setContext('key', uiState.key);
</script>

{@render children?.()}