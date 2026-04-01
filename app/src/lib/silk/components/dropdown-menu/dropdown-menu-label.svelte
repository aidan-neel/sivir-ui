<script lang="ts">
    import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';
	import type { Snippet } from 'svelte';

    const key = Math.random().toString(36).substring(2);

    type Props = {
        children: Snippet;
        class: string;
    }

    let { children, class: className, ...rest}: Props = $props();
</script>

<p {...rest} data-ui="menu-label" class={cn(className, "text-[length:var(--text-xs)] font-medium text-[var(--menu-label-foreground)] select-none px-2 py-2 pb-1")}>
    {@render children?.()}
</p>
