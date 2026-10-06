<script lang="ts">
    import * as Tool from '@sivir-ui/svelte/components/tool';
    import {
        type ToolSettings,
        toolContent,
        toolDefaults,
        toolInput
    } from '../playground/playground';

    let {
        state = toolDefaults.state,
        open = $bindable(toolDefaults.open),
        durations = toolDefaults.durations
    }: Partial<ToolSettings> = $props();

    const content = $derived(toolContent[state]);
    const output = $derived(content.output.join('\n'));

    function duration(value: string | undefined) {
        return durations ? value : undefined;
    }
</script>

<Tool.Root {state} bind:open class="w-full max-w-xl">
    <Tool.Trigger title={content.title} duration={duration(content.duration)} />
    <Tool.Content>
        <Tool.Call action="Search" target="usePreferences" duration={duration('84ms')} />
        <Tool.Call action="Read file" target="src/lib/preferences.ts" duration={duration('12ms')} />
        <Tool.Call
            action="Read file"
            target="src/routes/settings/+page.svelte"
            duration={duration('9ms')}
        />
        <Tool.Call
            action={content.action}
            target="bun test preferences"
            {state}
            duration={duration(content.callDuration)}
        >
            <Tool.Output>
                <pre class="font-mono text-xs leading-5">{output}</pre>
            </Tool.Output>
            <Tool.Input>{toolInput}</Tool.Input>
        </Tool.Call>
    </Tool.Content>
</Tool.Root>
