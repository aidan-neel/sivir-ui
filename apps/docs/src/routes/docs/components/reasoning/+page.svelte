<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand, PropGroup, PropSwitch } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import Streaming from './examples/streaming.svelte';
    import StreamingSrc from './examples/streaming.svelte?raw';
    import {
        changedReasoningProps,
        type ReasoningSettings,
        reasoningCode,
        reasoningDefaults,
        reasoningTitle
    } from './playground/playground';

    const TITLE = 'Reasoning';
    const SLUG = 'reasoning';
    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    let settings = $state<ReasoningSettings>({
        ...reasoningDefaults
    });

    const heroCode = $derived(reasoningCode(settings));
    const changed = $derived(changedReasoningProps(settings));
</script>

{#snippet heroProps()}
    <PropGroup title="State">
        <PropSwitch label="Streaming" bind:checked={settings.streaming} />
    </PropGroup>
    <PropGroup title="Trigger">
        <PropSwitch label="Title" bind:checked={settings.title} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A collapsible trigger and panel for a model's reasoning trace, with a live thinking timer."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                The trigger reads Thinking while the model reasons and Thought for 4.8s when it
                finishes. The trace stays collapsed above the answer until the user opens it.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={heroProps} {changed}>
            <Hero
                streaming={settings.streaming}
                title={settings.title ? reasoningTitle : undefined}
            />
        </ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Set <Typography.InlineCode>streaming</Typography.InlineCode> on
            <Typography.InlineCode>Root</Typography.InlineCode>
            while the model is thinking, and update
            <Typography.InlineCode>duration</Typography.InlineCode>
            on
            <Typography.InlineCode>Trigger</Typography.InlineCode>
            for a live timer. A
            <Typography.InlineCode>title</Typography.InlineCode>
            replaces the Thinking and Thought for label with a one-line summary and hides the
            duration. Content mounts on its first open and stays mounted, so a streamed trace keeps
            growing in place. Bind
            <Typography.InlineCode>open</Typography.InlineCode>
            to control visibility.
        </Typography.Text>
        <CodeBlock
            code={`import * as Reasoning from '@sivir-ui/svelte/components/reasoning';

<Reasoning.Root>
  <Reasoning.Trigger duration="2.4s" />
  <Reasoning.Content>
    <p>Compared the incident timestamp with the last five deployments.</p>
  </Reasoning.Content>
</Reasoning.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="live-reasoning" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Live reasoning </Typography.H3>
            <ComponentPreview code={StreamingSrc}>
                <Streaming />
            </ComponentPreview>
        </div>
    </section>
</div>
