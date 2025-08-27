<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';
	import type { Snippet } from 'svelte';

    const key = Math.random().toString(36).substring(2);

    type Props = {
        children: Snippet;
        class: string;
    }

    let { children, class: className, ...rest}: Props = $props();
</script>

<p {...rest} class={cn(className, "select-none px-3 py-2 pb-1 font-semibold text-foreground")}>
    {@render children?.()}
</p>