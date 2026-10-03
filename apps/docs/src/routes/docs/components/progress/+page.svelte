<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Determinate from './examples/determinate.svelte';
    import DeterminateSrc from './examples/determinate.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Indeterminate from './examples/indeterminate.svelte';
    import IndeterminateSrc from './examples/indeterminate.svelte?raw';
    import WithLabel from './examples/with-label.svelte';
    import WithLabelSrc from './examples/with-label.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add progress';
</script>

<svelte:head>
    <title>Sivir · Progress</title>
    <meta
        name="description"
        content="A bar that fills to show how far along a task is, or loops when progress can't be measured."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Progress </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                The bar fills to value out of max. Pass indeterminate when you can't measure
                progress; the bar then loops and ignores value.
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
            value defaults to 0 and max to 100. Values outside that range are clamped. Progress
            renders no label, so place one next to it.
        </Typography.Text>
        <CodeBlock
            code={`import { Progress } from '@sivir-ui/svelte/components/progress';\n\n<Progress value={28} />\n<Progress indeterminate />`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <!-- Determinate -->
        <div id="determinate" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Determinate</Typography.H3>
            <ComponentPreview code={DeterminateSrc}>
                <Determinate />
            </ComponentPreview>
        </div>

        <!-- Indeterminate -->
        <div id="indeterminate" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Indeterminate</Typography.H3>
            <ComponentPreview code={IndeterminateSrc}>
                <Indeterminate />
            </ComponentPreview>
        </div>

        <!-- With label -->
        <div id="with-label" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">With label</Typography.H3>
            <ComponentPreview code={WithLabelSrc}>
                <WithLabel />
            </ComponentPreview>
        </div>
    </section>
</div>
