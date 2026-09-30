<script lang="ts">
    import * as Tool from '@sivir-ui/svelte/components/tool';

    const error = [
        'src/lib/refunds.ts:42:18',
        "Type 'string | undefined' is not assignable to type 'string'."
    ].join('\n');
</script>

<Tool.Root state="error" open class="w-full max-w-xl">
    <Tool.Trigger title="Ran 2 commands, 1 failed" duration="2.8s" />
    <Tool.Content>
        <Tool.Call action="Run" target="bun run lint" duration="1.1s" />
        <Tool.Call action="Run" target="bun run build" state="error" duration="1.7s" open>
            <Tool.Output label="Error">
                <pre class="font-mono text-xs leading-5 whitespace-pre-wrap">{error}</pre>
            </Tool.Output>
        </Tool.Call>
    </Tool.Content>
</Tool.Root>
