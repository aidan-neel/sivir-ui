<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { getCommandContext } from './context.svelte';

    const command = getCommandContext();

    type Props = {
        children: Snippet;
        class?: string;
        heading: string;
    };

    let { children, class: className, heading, ...rest }: Props = $props();
</script>

<div
    {...rest}
    data-ui="command-group"
    role="group"
    aria-label={heading}
    data-searching={command.searchContent !== '' || undefined}
    class="flex flex-col gap-0.5 pt-0.5"
>
    <p
        class={cn(
            className,
            'sivir-menu-label [[data-searching]>&]:hidden'
        )}
    >
        {heading}
    </p>

    {@render children?.()}
</div>
