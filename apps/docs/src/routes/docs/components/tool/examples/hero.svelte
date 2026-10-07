<script lang="ts">
    import FileText from '@lucide/svelte/icons/file-text';
    import Search from '@lucide/svelte/icons/search';
    import Terminal from '@lucide/svelte/icons/terminal';
    import * as Tool from '@sivir-ui/svelte/components/tool';
    import {
        type ToolSettings,
        toolContent,
        toolDefaults,
        toolInput,
        toolStatus
    } from '../playground/playground';

    let {
        running = toolDefaults.running,
        failed = toolDefaults.failed,
        icons = toolDefaults.icons
    }: Partial<ToolSettings> = $props();

    const content = $derived(
        toolContent({
            running,
            failed,
            icons
        })
    );
    const output = $derived(content.output.join('\n'));
</script>

{#snippet searchIcon()}
    <Search />
{/snippet}

{#snippet fileIcon()}
    <FileText />
{/snippet}

{#snippet terminalIcon()}
    <Terminal />
{/snippet}

<Tool.Root {running} duration={running ? undefined : 4} open class="w-full max-w-xl">
    <Tool.Trigger status={toolStatus} summary={content.summary} />
    <Tool.Content>
        <Tool.Call
            action="Searched"
            target="usePreferences"
            icon={icons ? searchIcon : undefined}
        />
        <Tool.Call
            action="Read"
            target="src/lib/preferences.ts"
            icon={icons ? fileIcon : undefined}
        />
        <Tool.Call
            action="Read"
            target="src/routes/settings/+page.svelte"
            icon={icons ? fileIcon : undefined}
        />
        <Tool.Call
            action={content.action}
            target="bun test preferences"
            state={content.state}
            icon={icons ? terminalIcon : undefined}
            open
        >
            <Tool.Output>
                <pre class="font-mono text-xs leading-5">{output}</pre>
            </Tool.Output>
            <Tool.Input>{toolInput}</Tool.Input>
        </Tool.Call>
    </Tool.Content>
</Tool.Root>
