<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Horizontal from './examples/horizontal.svelte';
    import HorizontalSrc from './examples/horizontal.svelte?raw';

    const TITLE = 'Scroll Area';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add scroll-area';
</script>

<svelte:head>
    <title>Sivir · Scroll Area</title>
    <meta
        name="description"
        content="A scroll container with a thin theme-colored scrollbar and fade cues at edges with more content."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Wraps content in a scroll viewport with a theme-colored scrollbar. Set
                <Typography.InlineCode>orientation</Typography.InlineCode>
                to vertical (the default), horizontal, or both.
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
            Give ScrollArea a height or max height.
            <Typography.InlineCode>class</Typography.InlineCode>
            styles the outer frame. Other attributes, such as
            <Typography.InlineCode>aria-label</Typography.InlineCode>, go on the scrolling viewport,
            which you can bind with <Typography.InlineCode>bind:element</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock
            code={`import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';\n\nconst files = ['README.md', 'package.json', 'src/app.css', 'src/routes/+page.svelte'];\n\n<ScrollArea class="h-48 w-64 rounded-lg border" aria-label="Changed files">\n  {#each files as file (file)}\n    <p class="px-3 py-2 text-sm">{file}</p>\n  {/each}\n</ScrollArea>`}
            lang="svelte"
            copy="overlay"
        />

        <Typography.Text variant="supporting">
            In vertical orientation, a fade with a chevron appears at each edge that has more
            content to scroll. Pass
            <Typography.InlineCode>{'showCues={false}'}</Typography.InlineCode>
            to hide the cues, or <Typography.InlineCode>blur</Typography.InlineCode> to blur the
            content that scrolls under them.
        </Typography.Text>
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <div id="horizontal" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Horizontal</Typography.H3>
            <ComponentPreview code={HorizontalSrc}>
                <Horizontal />
            </ComponentPreview>
        </div>
    </section>
</div>
