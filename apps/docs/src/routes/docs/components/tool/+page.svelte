<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Failed from './examples/failed.svelte';
    import FailedSrc from './examples/failed.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Live from './examples/live.svelte';
    import LiveSrc from './examples/live.svelte?raw';

    const TITLE = 'Tool';
    const SLUG = 'tool';
    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="Collapsible groups of AI tool calls designed for inline chat transcripts."
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
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Tool starts collapsed. <Typography.InlineCode>Trigger</Typography.InlineCode> shows a
            status glyph, a one-sentence
            <Typography.InlineCode>title</Typography.InlineCode>, and an optional
            <Typography.InlineCode>duration</Typography.InlineCode>; the title shimmers while
            <Typography.InlineCode>state</Typography.InlineCode>
            is
            <Typography.InlineCode>running</Typography.InlineCode>. Content mounts on its first open
            and stays mounted, so calls can keep arriving while it is closed.
        </Typography.Text>
        <CodeBlock
            code={`import * as Tool from '@sivir-ui/svelte/components/tool';

<Tool.Root state="complete">
  <Tool.Trigger title="Searched once, read 1 file" duration="1.4s" />
  <Tool.Content>
    <Tool.Call action="Search" target="usePreferences" duration="84ms" />
    <Tool.Call action="Read file" target="src/lib/preferences.ts" duration="12ms" />
  </Tool.Content>
</Tool.Root>`}
            lang="svelte"
            copy="overlay"
        />
        <Typography.Text variant="supporting">
            Each <Typography.InlineCode>Call</Typography.InlineCode> is one row: an
            <Typography.InlineCode>action</Typography.InlineCode>, a monospace
            <Typography.InlineCode>target</Typography.InlineCode>, and a trailing
            <Typography.InlineCode>duration</Typography.InlineCode>. Rows in the same Content share
            columns, so targets line up however long the actions are. Give a Call children, usually
            <Typography.InlineCode>Output</Typography.InlineCode>
            and
            <Typography.InlineCode>Input</Typography.InlineCode>, and the row becomes a button that
            expands them. Set a Call's
            <Typography.InlineCode>state</Typography.InlineCode>
            to show a spinner while it runs or mark it failed.
        </Typography.Text>
        <CodeBlock
            code={`<Tool.Call action="Run" target="bun test" state="error" duration="1.7s">
  <Tool.Output label="Error">
    <pre>2 tests failed</pre>
  </Tool.Output>
  <Tool.Input>{JSON.stringify(input, null, 2)}</Tool.Input>
</Tool.Call>`}
            lang="svelte"
            copy="overlay"
        />
        <Typography.Text variant="supporting">
            Pass a <Typography.InlineCode>children</Typography.InlineCode> snippet to
            <Typography.InlineCode>Trigger</Typography.InlineCode>
            in place of
            <Typography.InlineCode>title</Typography.InlineCode>
            to render your own label. It receives
            <Typography.InlineCode>open</Typography.InlineCode>
            and
            <Typography.InlineCode>state</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock
            code={`<Tool.Trigger>
  {#snippet children({ open, state })}
    {state === 'running' ? 'Checking refunds' : 'Checked refunds'} {open ? '−' : '+'}
  {/snippet}
</Tool.Trigger>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>
        <div id="coding-agent" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Coding agent</Typography.H3>
            <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
        </div>
        <div id="live-calls" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Live calls</Typography.H3>
            <Typography.Text variant="supporting">
                Tick <Typography.InlineCode>duration</Typography.InlineCode> from your own timer and
                switch each Call's action from Reading file to Read file as it finishes. Update the
                title to say what is still going, then sum the group once it completes.
            </Typography.Text>
            <ComponentPreview code={LiveSrc}><Live /></ComponentPreview>
        </div>
        <div id="failed-call" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Failed call</Typography.H3>
            <ComponentPreview code={FailedSrc}><Failed /></ComponentPreview>
        </div>
    </section>
</div>
