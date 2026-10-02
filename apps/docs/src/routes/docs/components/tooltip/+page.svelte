<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Bottom from './examples/bottom.svelte';
    import BottomSrc from './examples/bottom.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Right from './examples/right.svelte';
    import RightSrc from './examples/right.svelte?raw';
    import Top from './examples/top.svelte';
    import TopSrc from './examples/top.svelte?raw';

    const TITLE = 'Tooltip';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add tooltip';
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A short text label that appears when you hover or focus a control."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Labels icon buttons and dense controls. One tooltip is shared across the page, so
                moving between triggers moves the open tooltip instead of opening a new one.
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
            Wrap a focusable element in
            <Typography.InlineCode>Tooltip.Trigger</Typography.InlineCode>
            so keyboard users can open it too. Set
            <Typography.InlineCode>placement</Typography.InlineCode>
            to
            <Typography.InlineCode>top</Typography.InlineCode>
            (the default),
            <Typography.InlineCode>right</Typography.InlineCode>,
            <Typography.InlineCode>bottom</Typography.InlineCode>, or
            <Typography.InlineCode>left</Typography.InlineCode>. It opens after 125 ms; change this
            with <Typography.InlineCode>delay</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock
            code={`import { Button } from '@sivir-ui/svelte/components/button';\nimport * as Tooltip from '@sivir-ui/svelte/components/tooltip';\n\n<Tooltip.Root>\n  <Tooltip.Trigger>\n    <Button variant="outline">Share</Button>\n  </Tooltip.Trigger>\n  <Tooltip.Content>Copy a link to this page</Tooltip.Content>\n</Tooltip.Root>`}
            lang="svelte"
            copy="overlay"
        />
        <Typography.Text variant="supporting">
            Content renders as plain text. Put a
            <Typography.InlineCode>Shortcut</Typography.InlineCode>
            after the label to show it as a keycap, as in the toolbar above.
        </Typography.Text>
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <!-- Top placement -->
        <div id="top" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Top placement</Typography.H3>
            <ComponentPreview code={TopSrc}>
                <Top />
            </ComponentPreview>
        </div>

        <!-- Right placement -->
        <div id="right" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Right placement</Typography.H3>
            <ComponentPreview code={RightSrc}>
                <Right />
            </ComponentPreview>
        </div>

        <!-- Bottom placement -->
        <div id="bottom" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Bottom placement</Typography.H3>
            <ComponentPreview code={BottomSrc}>
                <Bottom />
            </ComponentPreview>
        </div>
    </section>
</div>
