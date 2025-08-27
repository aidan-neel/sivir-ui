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

<Popover.Content class={cn(props.class, "p-1")}>
    {@render props.children?.()}
</Popover.Content>