<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';
	import { getContext, type Snippet } from 'svelte';

    const key = getContext('key')

    type Props = {
        children: Snippet;
        class: string;
    }

    let props: Props = $props();
</script>

<Popover.Content allowClickOutside={false} class={cn(props.class, "p-1.5 px-2 shadow-none rounded-[0.4rem] border-none bg-foreground text-foreground-opposite font-medium text-xs")}>
    {@render props.children?.()}
</Popover.Content>