<script lang="ts">
    import * as Popover from '@silk/ui/components/popover';
	import { cn } from '@silk/ui/utils';
	import type { Snippet } from 'svelte';

    const key = Math.random().toString(36).substring(2);

    type Props = {
        children: Snippet;
        class: string;
    }

    let props: Props = $props();
</script>

<p {...props} data-ui="menu-label" class={cn(props.class, "text-[length:var(--text-xs)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-[var(--menu-label-foreground)] select-none px-[var(--menu-label-padding-x)] py-[var(--menu-label-padding-y)]")}>
    {@render props.children?.()}
</p>
