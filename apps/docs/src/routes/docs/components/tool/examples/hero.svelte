<script lang="ts">
    import * as Tool from '@sivir-ui/svelte/components/tool';

    const input = JSON.stringify(
        {
            command: 'bun test preferences',
            cwd: 'apps/web'
        },
        null,
        2
    );
    const output = [
        '✓ saves the theme preference',
        '✓ restores preferences after sign-in',
        '2 passed in 3.08s'
    ].join('\n');
</script>

<Tool.Root state="complete" open class="w-full max-w-xl">
    <Tool.Trigger title="Searched once, read 2 files, ran 1 command" duration="4.2s" />
    <Tool.Content>
        <Tool.Call action="Search" target="usePreferences" duration="84ms" />
        <Tool.Call action="Read file" target="src/lib/preferences.ts" duration="12ms" />
        <Tool.Call action="Read file" target="src/routes/settings/+page.svelte" duration="9ms" />
        <Tool.Call action="Run" target="bun test preferences" duration="3.1s">
            <Tool.Output>
                <pre class="font-mono text-xs leading-5">{output}</pre>
            </Tool.Output>
            <Tool.Input>{input}</Tool.Input>
        </Tool.Call>
    </Tool.Content>
</Tool.Root>
