<script lang="ts">
    import * as Popover from '$lib/ui/components/popover';
	import { cn } from '$lib/ui/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { ContextMenuSubContentProps } from '.';

    const key = getContext('key')

    let { class: className, children, ...rest }: ContextMenuSubContentProps = $props();
</script>

<Popover.Content {...rest} portal={false} class={cn(className, "p-1")}>
    {@render children?.()}
</Popover.Content>