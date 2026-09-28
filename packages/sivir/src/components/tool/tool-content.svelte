<script lang="ts">
    import { onDestroy } from 'svelte';
    import type { ToolContentProps } from '.';
    import { getToolContext } from './context.svelte';
    import Panel from './tool-panel.svelte';

    let { class: className, children, ...rest }: ToolContentProps = $props();

    const tool = getToolContext();
    onDestroy(tool.registerContent());
</script>

<Panel
    {...rest}
    id={`tool-${tool.id}`}
    open={tool.open}
    onsettle={tool.settle}
    data-ui="tool-content"
    class={[
        'grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] content-start gap-x-3 *:col-span-full',
        className
    ]}
>
    {@render children?.()}
</Panel>
