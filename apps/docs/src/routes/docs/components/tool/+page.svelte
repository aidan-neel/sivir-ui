<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand, PropGroup, PropSwitch } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Failed from './examples/failed.svelte';
    import FailedSrc from './examples/failed.svelte?raw';
    import Hero from './examples/hero.svelte';
    import Live from './examples/live.svelte';
    import LiveSrc from './examples/live.svelte?raw';
    import {
        changedToolProps,
        type ToolSettings,
        toolCode,
        toolDefaults
    } from './playground/playground';

    const TITLE = 'Tool';
    const SLUG = 'tool';
    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    let settings = $state<ToolSettings>({
        ...toolDefaults
    });

    const heroCode = $derived(toolCode(settings));
    const changed = $derived(changedToolProps(settings));
    const codingAgentCode = toolCode(toolDefaults);
</script>

{#snippet heroProps()}
    <PropGroup title="State">
        <PropSwitch label="Running" bind:checked={settings.running} />
        <PropSwitch label="Failed" bind:checked={settings.failed} />
    </PropGroup>
    <PropGroup title="Content">
        <PropSwitch label="Icons" bind:checked={settings.icons} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A collapsible group of an assistant's tool calls, summarized on one line in a chat transcript."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Summarize a run of tool calls in one line, and let users open it to see each search,
                read, and command the assistant ran.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={heroProps} {changed}>
            <Hero running={settings.running} failed={settings.failed} icons={settings.icons} />
        </ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Tool is styled to match Reasoning, so a run of tool calls sits beside a reasoning trace
            without a second visual language. Set
            <Typography.InlineCode>running</Typography.InlineCode>
            on
            <Typography.InlineCode>Root</Typography.InlineCode>
            while the calls run. Turning it on opens the calls and starts a timer.
            <Typography.InlineCode>Trigger</Typography.InlineCode>
            shows a shimmering <Typography.InlineCode>status</Typography.InlineCode>, such as
            “Running tests”, then settles into its
            <Typography.InlineCode>summary</Typography.InlineCode>. Without a summary it reads
            “Worked for” and the elapsed time. Pass
            <Typography.InlineCode>duration</Typography.InlineCode>
            in seconds to restore a saved transcript. Content mounts on its first open and stays
            mounted, so calls can keep arriving while it is closed.
        </Typography.Text>
        <CodeBlock
            code={`import * as Tool from '@sivir-ui/svelte/components/tool';

<Tool.Root running={busy}>
  <Tool.Trigger status="Running tests" summary="Edited 2 files, ran tests" />
  <Tool.Content>
    <Tool.Call action="Read" target="src/lib/rate-limit.ts" />
    <Tool.Call action="Running" target="bun test" state="running" />
  </Tool.Content>
</Tool.Root>`}
            lang="svelte"
            copy="overlay"
        />
        <Typography.Text variant="supporting">
            Each <Typography.InlineCode>Call</Typography.InlineCode> sits on the rail with an
            <Typography.InlineCode>action</Typography.InlineCode>
            and a monospace
            <Typography.InlineCode>target</Typography.InlineCode>. A call with
            <Typography.InlineCode>state="running"</Typography.InlineCode>
            shimmers its action, and
            <Typography.InlineCode>state="error"</Typography.InlineCode>
            marks it failed. Calls blur in as they are added. Give a call an
            <Typography.InlineCode>icon</Typography.InlineCode>
            snippet to replace the dot on the rail. Give it children, usually
            <Typography.InlineCode>Output</Typography.InlineCode>
            and
            <Typography.InlineCode>Input</Typography.InlineCode>, and the row becomes a button that
            expands them.
        </Typography.Text>
        <CodeBlock
            code={`import Terminal from '@lucide/svelte/icons/terminal';
import * as Tool from '@sivir-ui/svelte/components/tool';

<Tool.Call action="Ran" target="bun test" state="error">
  {#snippet icon()}<Terminal />{/snippet}
  <Tool.Output label="Error">
    <pre>2 tests failed</pre>
  </Tool.Output>
  <Tool.Input>{JSON.stringify({ command: 'bun test' }, null, 2)}</Tool.Input>
</Tool.Call>`}
            lang="svelte"
            copy="overlay"
        />
        <Typography.Text variant="supporting">
            <Typography.InlineCode>Trigger</Typography.InlineCode>
            shows no icon by default. Pass an
            <Typography.InlineCode>icon</Typography.InlineCode>
            snippet to add one, or a
            <Typography.InlineCode>children</Typography.InlineCode>
            snippet to render your own label. Both receive
            <Typography.InlineCode>open</Typography.InlineCode>,
            <Typography.InlineCode>running</Typography.InlineCode>, and
            <Typography.InlineCode>seconds</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock
            code={`import Wrench from '@lucide/svelte/icons/wrench';
import * as Tool from '@sivir-ui/svelte/components/tool';

<Tool.Trigger status="Running tests">
  {#snippet icon({ running })}
    <Wrench class={running ? 'animate-pulse' : ''} />
  {/snippet}
</Tool.Trigger>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Example Descriptions ──────────────────────────────────── -->
    {#snippet liveCallsDescription()}
        <Typography.Text variant="supporting">
            Root times the group while
            <Typography.InlineCode>running</Typography.InlineCode>
            is on. Give a running call a present-tense
            <Typography.InlineCode>action</Typography.InlineCode>, such as “Reading”, and change it
            to “Read” when the call finishes; the label crossfades. Set the trigger
            <Typography.InlineCode>status</Typography.InlineCode>
            to the current step. This example swaps each call's icon for a spinner while it runs.
        </Typography.Text>
    {/snippet}

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="coding-agent" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Coding agent </Typography.H3>
            <ComponentPreview code={codingAgentCode}>
                <Hero />
            </ComponentPreview>
        </div>

        <div id="live-calls" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Live calls </Typography.H3>
            <ComponentPreview code={LiveSrc}>
                <Live />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render liveCallsDescription()}
            </div>
        </div>

        <div id="failed-call" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Failed call </Typography.H3>
            <ComponentPreview code={FailedSrc}>
                <Failed />
            </ComponentPreview>
        </div>
    </section>
</div>
