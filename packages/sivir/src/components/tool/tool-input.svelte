<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ToolInputProps } from '.';

    let { label = 'Input', children, class: className, ...rest }: ToolInputProps = $props();
</script>

<div data-ui="tool-input" class={cn(className, 'flex min-w-0 flex-col gap-1')} {...rest}>
    <span class="text-xs text-foreground-muted">{label}</span>
    <div class="max-h-72 overflow-auto rounded-[var(--radius-md)] bg-secondary/60 px-2.5 py-2">
        <pre
            class="m-0 bg-transparent p-0 font-mono text-xs leading-5 whitespace-pre-wrap break-all text-foreground"
        ><code
                >{@render children?.()}</code
            ></pre>
    </div>
</div>
