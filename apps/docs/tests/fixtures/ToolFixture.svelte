<script lang="ts">
    import * as Tool from '@sivir-ui/svelte/components/tool';

    let {
        state = 'running',
        open = false,
        callState = 'complete',
        withDetails = false
    }: {
        state?: Tool.ToolState;
        open?: boolean;
        callState?: Tool.ToolState;
        withDetails?: boolean;
    } = $props();
</script>

<Tool.Root {state} {open}>
    <Tool.Trigger title="Checked the deployment" duration="6s" />
    <Tool.Content>
        {#if withDetails}
            <Tool.Call action="Run" target="vercel inspect" state={callState} duration="2s">
                <Tool.Output>Ready</Tool.Output>
            </Tool.Call>
        {:else}
            <Tool.Call action="Run" target="vercel inspect" state={callState} duration="2s" />
        {/if}
    </Tool.Content>
</Tool.Root>
