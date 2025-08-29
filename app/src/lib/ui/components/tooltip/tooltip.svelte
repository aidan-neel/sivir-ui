<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { useState } from '$lib/ui/internals/state.svelte';
	import type { Snippet } from 'svelte';

    const key = Math.random().toString(36).substring(2);
    
    type Props = {
        children: Snippet;
        class: string;
        delay: number;
        placement: 'top' | 'left' | 'bottom' | 'right';
    }

    let { class: className, children, delay = 500, placement = 'top', ...rest}: Props = $props();
</script>

<Popover.Root closeDelay={0} placement={placement} delay={delay} hoverable={true} {...rest} state_key={key} class={className}>
    {@render children?.()}
</Popover.Root>