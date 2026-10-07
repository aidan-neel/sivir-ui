<script lang="ts">
    import * as Tool from '@sivir-ui/svelte/components/tool';

    let {
        running = false,
        open = false,
        callState = 'complete',
        withDetails = false
    }: {
        running?: boolean;
        open?: boolean;
        callState?: Tool.ToolState;
        withDetails?: boolean;
    } = $props();
</script>

<Tool.Root {running} {open} duration={6}>
    <Tool.Trigger status="Checking the deployment" summary="Checked the deployment" />
    <Tool.Content>
        {#if withDetails}
            <Tool.Call action="Ran" target="vercel inspect" state={callState}>
                <Tool.Output>Ready</Tool.Output>
            </Tool.Call>
        {:else}
            <Tool.Call action="Ran" target="vercel inspect" state={callState} />
        {/if}
    </Tool.Content>
</Tool.Root>
