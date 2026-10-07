<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand, PropGroup, PropSwitch } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Default from './examples/default.svelte';
    import DefaultSrc from './examples/default.svelte?raw';
    import Disabled from './examples/disabled.svelte';
    import DisabledSrc from './examples/disabled.svelte?raw';
    import Hero from './examples/hero.svelte';
    import Nested from './examples/nested.svelte';
    import NestedSrc from './examples/nested.svelte?raw';
    import {
        type CollapsibleSettings,
        changedCollapsibleProps,
        collapsibleCode,
        collapsibleDefaults
    } from './playground/playground';

    const TITLE = 'Collapsible';
    const SLUG = 'collapsible';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    let settings = $state<CollapsibleSettings>({
        ...collapsibleDefaults
    });

    const heroCode = $derived(collapsibleCode(settings));
    const changed = $derived(changedCollapsibleProps(settings));
</script>

{#snippet heroProps()}
    <PropGroup title="State">
        <PropSwitch label="Open" bind:checked={settings.open} />
        <PropSwitch label="Disabled" bind:checked={settings.disabled} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A trigger button that shows and hides a single panel of content."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A single panel that expands and collapses. The trigger shows a chevron that turns
                when the panel opens, and the content lines up with the trigger's label.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={heroProps} {changed}>
            <Hero bind:open={settings.open} disabled={settings.disabled} />
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Bind <Typography.InlineCode>open</Typography.InlineCode> to read or set the state. It
            starts as <Typography.InlineCode>false</Typography.InlineCode>. Set
            <Typography.InlineCode>disabled</Typography.InlineCode>
            on Root to disable the trigger.
        </Typography.Text>
        <Typography.Text variant="supporting">
            Trigger renders its own chevron and fills the width of its container. Content is
            indented to the trigger label and styled as supporting text, so pass plain text or your
            own markup without adding padding. Root renders no element, so wrap it in a
            <Typography.InlineCode>div</Typography.InlineCode>
            when a list needs dividers or spacing between items.
        </Typography.Text>
        <CodeBlock
            code={`import * as Collapsible from '@sivir-ui/svelte/components/collapsible';\n\nlet open = $state(false);\n\n<Collapsible.Root bind:open>\n  <Collapsible.Trigger>Order details</Collapsible.Trigger>\n  <Collapsible.Content>3 items, shipped March 4.</Collapsible.Content>\n</Collapsible.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="default" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Settings </Typography.H3>
            <ComponentPreview code={DefaultSrc}>
                <Default />
            </ComponentPreview>
        </div>

        <div id="faq" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> FAQ list </Typography.H3>
            <ComponentPreview code={NestedSrc}>
                <Nested />
            </ComponentPreview>
        </div>

        <div id="disabled" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Disabled </Typography.H3>
            <ComponentPreview code={DisabledSrc}>
                <Disabled />
            </ComponentPreview>
        </div>
    </section>
</div>
