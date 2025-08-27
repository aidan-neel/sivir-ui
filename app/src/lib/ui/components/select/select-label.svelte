<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';
	import type { Snippet } from 'svelte';

    const key = Math.random().toString(36).substring(2);

    type Props = {
        children: Snippet;
        class: string;
    }

    let props: Props = $props();
</script>

<p {...props} class={cn(props.class, "text-xs select-none px-2 pb-0.5 pt-2 text-foreground-muted font-medium")}>
    {@render props.children?.()}
</p>