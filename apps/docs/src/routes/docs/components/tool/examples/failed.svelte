<script lang="ts">
    import Terminal from '@lucide/svelte/icons/terminal';
    import * as Tool from '@sivir-ui/svelte/components/tool';

    const error = [
        'src/lib/refunds.ts:42:18',
        "Type 'string | undefined' is not assignable to type 'string'."
    ].join('\n');
</script>

<Tool.Root duration={3} open class="w-full max-w-xl">
    <Tool.Trigger summary="Ran 2 commands, 1 failed" />
    <Tool.Content>
        <Tool.Call action="Ran" target="bun run lint">
            {#snippet icon()}
                <Terminal />
            {/snippet}
        </Tool.Call>
        <Tool.Call action="Ran" target="bun run build" state="error" open>
            {#snippet icon()}
                <Terminal />
            {/snippet}
            <Tool.Output label="Error">
                <pre class="font-mono text-xs leading-5 whitespace-pre-wrap">{error}</pre>
            </Tool.Output>
        </Tool.Call>
    </Tool.Content>
</Tool.Root>
