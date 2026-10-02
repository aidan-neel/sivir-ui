<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Descriptions from './examples/descriptions.svelte';
    import DescriptionsSrc from './examples/descriptions.svelte?raw';
    import Disabled from './examples/disabled.svelte';
    import DisabledSrc from './examples/disabled.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const _TITLE = 'Radio Group';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add radio-group';
</script>

<svelte:head>
    <title>Sivir · Radio Group</title>
    <meta
        name="description"
        content="A set of radio options where selecting one clears the others, with a bindable value."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Radio Group </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Each item renders a native radio input with an optional label and description. With
                a shared name, arrow keys move the selection within the group.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Bind <Typography.InlineCode>value</Typography.InlineCode> on
            <Typography.InlineCode>RadioGroup.Root</Typography.InlineCode>
            and give it a <Typography.InlineCode>name</Typography.InlineCode>. Each item's input id
            defaults to <Typography.InlineCode>radio-</Typography.InlineCode> plus its value, so
            pass
            <Typography.InlineCode>id</Typography.InlineCode>
            when two groups on one page share values.
        </Typography.Text>
        <CodeBlock
            code={`import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';\n\nlet plan = $state('free');\n\n<RadioGroup.Root bind:value={plan} name="plan">\n  <RadioGroup.Item value="free" label="Free" />\n  <RadioGroup.Item value="pro" label="Pro" />\n</RadioGroup.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <!-- With descriptions -->
        <div id="descriptions" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">With descriptions</Typography.H3>
            <ComponentPreview code={DescriptionsSrc}>
                <Descriptions />
            </ComponentPreview>
        </div>

        <!-- Disabled -->
        <div id="disabled" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Disabled</Typography.H3>
            <ComponentPreview code={DisabledSrc}>
                <Disabled />
            </ComponentPreview>
        </div>
    </section>
</div>
