<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import ContentOnly from './examples/content-only.svelte';
    import ContentOnlySrc from './examples/content-only.svelte?raw';
    import Full from './examples/full.svelte';
    import FullSrc from './examples/full.svelte?raw';
    import HeaderFooter from './examples/header-footer.svelte';
    import HeaderFooterSrc from './examples/header-footer.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Inset from './examples/inset.svelte';
    import InsetSrc from './examples/inset.svelte?raw';
    import Panel from './examples/panel.svelte';
    import PanelSrc from './examples/panel.svelte?raw';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add card';
</script>

<svelte:head>
    <title>Sivir · Card</title>
    <meta
        name="description"
        content="A container that groups a title, body content, and actions on one surface."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Card </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A bordered surface built from Header, Title, Description, Content, and Footer. The
                panel and inset variants add a frame around it; inset also moves the footer into a
                bar below it.
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
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Card.Root takes a variant of default (a bordered surface), panel, or inset. Every other
            part is optional.
        </Typography.Text>
        <CodeBlock
            code={`import { Button } from '@sivir-ui/svelte/components/button';\nimport * as Card from '@sivir-ui/svelte/components/card';\n\n<Card.Root>\n  <Card.Header>\n    <Card.Title>Delete project?</Card.Title>\n    <Card.Description>This removes all deployments and logs.</Card.Description>\n  </Card.Header>\n  <Card.Footer>\n    <Button variant="outline">Cancel</Button>\n    <Button variant="destructive">Delete</Button>\n  </Card.Footer>\n</Card.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="full" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Full composition </Typography.H3>
            <ComponentPreview code={FullSrc}>
                <Full />
            </ComponentPreview>
        </div>

        <div id="content-only" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Content only </Typography.H3>
            <ComponentPreview code={ContentOnlySrc}>
                <ContentOnly />
            </ComponentPreview>
        </div>

        <div id="header-footer" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Header and footer </Typography.H3>
            <ComponentPreview code={HeaderFooterSrc}>
                <HeaderFooter />
            </ComponentPreview>
        </div>

        <div id="panel" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Panel frame </Typography.H3>
            <ComponentPreview code={PanelSrc}>
                <Panel />
            </ComponentPreview>
        </div>

        <div id="inset" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Inset frame </Typography.H3>
            <ComponentPreview code={InsetSrc}>
                <Inset />
            </ComponentPreview>
        </div>
    </section>
</div>
