<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { onDestroy } from 'svelte';
    import type { ToolContentProps } from '.';
    import { getToolContext } from './context.svelte';
    import Panel from './tool-panel.svelte';

    let { class: className, children, ...rest }: ToolContentProps = $props();

    const tool = getToolContext();
    onDestroy(tool.registerContent());
</script>

<Panel
    id={`tool-${tool.id}`}
    open={tool.open}
    onsettle={tool.settle}
    data-ui="tool-content"
    class="mt-2 mb-1"
>
    <ol {...rest} class={cn(className, 'm-0 flex list-none flex-col p-0 text-sm leading-body')}>
        {@render children?.()}
    </ol>
</Panel>
