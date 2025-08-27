<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';
	import { getContext, type Snippet } from 'svelte';

    const key = getContext('key')

    type Props = {
        children: Snippet;
        class: string;
    }

    let { children, class: className, ...rest }: Props = $props();
</script>

<div {...rest} class={cn(className, "h-[1px] bg-border my-1 mx-[-4px]")}>
    {@render children?.()}
</div>