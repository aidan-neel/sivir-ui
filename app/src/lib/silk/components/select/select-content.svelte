<script lang="ts">
    import * as Popover from '$lib/silk/components/popover';
	import { cn } from '$lib/silk/utils';
	import { getContext, type Snippet } from 'svelte';

    const key = getContext('key')

    type Props = {
        children: Snippet;
        class: string;
    }

    let props: Props = $props();
</script>

<Popover.Content data-ui="select-content" class={cn(props.class, "bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-[var(--panel-border)] rounded-[var(--panel-radius)] shadow-[inset_0_1px_0_var(--panel-highlight),var(--panel-shadow)] p-1")}>
    {@render props.children?.()}
</Popover.Content>
