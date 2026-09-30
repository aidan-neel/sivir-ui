<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ToolOutputProps } from '.';

    let { label = 'Output', children, class: className, ...rest }: ToolOutputProps = $props();
</script>

<div data-ui="tool-output" class={cn(className, 'flex min-w-0 flex-col gap-1')} {...rest}>
    <span class="text-xs text-foreground-muted">{label}</span>
    <div
        class="max-h-72 overflow-auto rounded-[var(--radius-md)] bg-secondary/60 px-2.5 py-2 text-sm leading-5 text-foreground"
    >
        {@render children?.()}
    </div>
</div>
