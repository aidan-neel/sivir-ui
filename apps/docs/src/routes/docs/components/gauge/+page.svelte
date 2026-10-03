<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import ContextWindow from './examples/context-window.svelte';
    import ContextWindowSrc from './examples/context-window.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import UsageLimit from './examples/usage-limit.svelte';
    import UsageLimitSrc from './examples/usage-limit.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add gauge';
</script>

<svelte:head>
    <title>Sivir · Gauge</title>
    <meta
        name="description"
        content="A small circular meter for a value out of a maximum, such as context remaining or API usage."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Gauge </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A ring that fills to value out of max and shows the number in its center. tone sets
                the arc color: primary, muted, success, warning, or error.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            <Typography.InlineCode>value</Typography.InlineCode>
            is required;
            <Typography.InlineCode>max</Typography.InlineCode>
            defaults to 100 and <Typography.InlineCode>size</Typography.InlineCode> to 28px. Without
            <Typography.InlineCode>label</Typography.InlineCode>, screen readers announce the meter
            as "85 of 100", so pass a label that says what it measures. Children replace the number
            in the center.
        </Typography.Text>
        <CodeBlock
            code={`import { Gauge } from '@sivir-ui/svelte/components/gauge';

<Gauge value={85} label="Context remaining" />
<Gauge value={72} max={100} label="Monthly API usage" tone="warning">72%</Gauge>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="context-window" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Context window </Typography.H3>
            <ComponentPreview code={ContextWindowSrc}><ContextWindow /></ComponentPreview>
        </div>

        <div id="usage-limit" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Usage limit </Typography.H3>
            <ComponentPreview code={UsageLimitSrc}><UsageLimit /></ComponentPreview>
        </div>
    </section>
</div>
