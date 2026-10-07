<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand, PropGroup, PropSwitch } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import Sources from './examples/sources.svelte';
    import SourcesSrc from './examples/sources.svelte?raw';
    import Streaming from './examples/streaming.svelte';
    import StreamingSrc from './examples/streaming.svelte?raw';
    import {
        changedReasoningProps,
        type ReasoningSettings,
        reasoningCode,
        reasoningDefaults,
        reasoningSummary
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
        <PropSwitch label="Summary" bind:checked={settings.summary} />
        <PropSwitch label="Orb" bind:checked={settings.orb} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A live, collapsible trace of a model's steps, with an activity label, an elapsed timer, and a short summary once it settles."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                While the model works, the trigger names the current step, counts the seconds, and
                opens the trace. When it finishes, the label settles into a short summary like
                Worked for 6s, and the trail stays one tap away.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={heroProps} {changed}>
            <Hero
                streaming={settings.streaming}
                summary={settings.summary ? reasoningSummary : undefined}
                orb={settings.orb}
            />
        </ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <div class="flex flex-col gap-3">
            <div>
                <Typography.H3>Live reasoning</Typography.H3>
                <Typography.Text variant="supporting" class="mt-1">
                    Set <Typography.InlineCode>streaming</Typography.InlineCode> on
                    <Typography.InlineCode>Root</Typography.InlineCode>
                    while the model works. The trace opens and the elapsed seconds count up. Pass
                    the current activity as
                    <Typography.InlineCode>status</Typography.InlineCode>
                    on
                    <Typography.InlineCode>Trigger</Typography.InlineCode>; it defaults to Thinking.
                    When
                    <Typography.InlineCode>streaming</Typography.InlineCode>
                    turns off, the trace stays as it is and the trigger reads Worked for and the
                    elapsed time, or your
                    <Typography.InlineCode>summary</Typography.InlineCode>. Bind
                    <Typography.InlineCode>open</Typography.InlineCode>
                    to control visibility yourself.
                </Typography.Text>
            </div>
            <CodeBlock
                code={`import * as Reasoning from '@sivir-ui/svelte/components/reasoning';

<Reasoning.Root {streaming}>
  <Reasoning.Trigger status="Reading the release history" />
  <Reasoning.Content>
    <p>Compared the incident timestamp with the last five deployments.</p>
  </Reasoning.Content>
</Reasoning.Root>`}
                lang="svelte"
                copy="overlay"
            />
        </div>

        <div class="flex flex-col gap-3">
            <div>
                <Typography.H3>Steps</Typography.H3>
                <Typography.Text variant="supporting" class="mt-1">
                    Compose
                    <Typography.InlineCode>Steps</Typography.InlineCode>
                    and
                    <Typography.InlineCode>Step</Typography.InlineCode>
                    inside
                    <Typography.InlineCode>Content</Typography.InlineCode>
                    for a trail joined by a rail. An
                    <Typography.InlineCode>active</Typography.InlineCode>
                    step shimmers its title, an
                    <Typography.InlineCode>icon</Typography.InlineCode>
                    snippet replaces the dot, and
                    <Typography.InlineCode>collapsible</Typography.InlineCode>
                    turns the title into a toggle for the body.
                </Typography.Text>
            </div>
            <CodeBlock
                code={`<Reasoning.Content>
  <Reasoning.Steps>
    <Reasoning.Step title="Searched 3 websites" collapsible>
      {#snippet icon()}<Globe />{/snippet}
      <!-- Source chips -->
    </Reasoning.Step>
    <Reasoning.Step title="Planning the layout" status="active">
      Name each step as it happens.
    </Reasoning.Step>
  </Reasoning.Steps>
</Reasoning.Content>`}
                lang="svelte"
                copy="overlay"
            />
        </div>

        <div class="flex flex-col gap-3">
            <div>
                <Typography.H3>Trigger icon</Typography.H3>
                <Typography.Text variant="supporting" class="mt-1">
                    The trigger shows no icon by default. Pass an
                    <Typography.InlineCode>icon</Typography.InlineCode>
                    snippet to render one before the label. It receives the trigger state, so
                    <Typography.InlineCode>Orb</Typography.InlineCode>
                    can fill while
                    <Typography.InlineCode>streaming</Typography.InlineCode>
                    is on, or you can render any 14px icon.
                </Typography.Text>
            </div>
            <CodeBlock
                code={`<Reasoning.Trigger {status}>
  {#snippet icon({ streaming })}
    <Reasoning.Orb active={streaming} />
  {/snippet}
</Reasoning.Trigger>`}
                lang="svelte"
                copy="overlay"
            />
        </div>

        <div class="flex flex-col gap-3">
            <div>
                <Typography.H3>Restored transcripts</Typography.H3>
                <Typography.Text variant="supporting" class="mt-1">
                    The trigger measures elapsed time while
                    <Typography.InlineCode>streaming</Typography.InlineCode>
                    is on. For a saved conversation, pass the recorded
                    <Typography.InlineCode>duration</Typography.InlineCode>
                    in seconds on
                    <Typography.InlineCode>Root</Typography.InlineCode>
                    instead.
                </Typography.Text>
            </div>
            <CodeBlock
                code={`<Reasoning.Root duration={42}>
  <Reasoning.Trigger />
  <Reasoning.Content>…</Reasoning.Content>
</Reasoning.Root>`}
                lang="svelte"
                copy="overlay"
            />
        </div>
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

        <div id="searched-sources" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Searched sources </Typography.H3>
            <ComponentPreview code={SourcesSrc}>
                <Sources />
            </ComponentPreview>
        </div>
    </section>
</div>
