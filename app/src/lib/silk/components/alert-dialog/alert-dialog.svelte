<script lang="ts">
	import { useState } from '$lib/silk/internals/state.svelte.ts';
	import { setContext } from 'svelte';
	import type { AlertDialogState, AlertDialogProps } from ".";

    let { open = $bindable(false), class: className, children }: AlertDialogProps = $props();

    const uiState = useState<AlertDialogState>({
        open: open
    })

    setContext('key', uiState.key);
</script>

{@render children?.()}
