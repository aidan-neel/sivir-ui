<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Basic from './examples/basic.svelte';
    import BasicSrc from './examples/basic.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Placements from './examples/placements.svelte';
    import PlacementsSrc from './examples/placements.svelte?raw';

    const _TITLE = 'Popover';

    const installCommand = 'bunx @sivir-ui/svelte add popover';
</script>

<svelte:head>
    <title>Sivir · Popover</title>
    <meta name="description" content="A floating surface anchored to a trigger element." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Popover </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Opens a panel next to its trigger. Set
                <Typography.InlineCode>placement</Typography.InlineCode>
                to any side and alignment; the panel flips to the opposite side when it would
                overflow the viewport.
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
            <Typography.InlineCode>Popover.Content</Typography.InlineCode>
            has
            <Typography.InlineCode>role="dialog"</Typography.InlineCode>
            and takes its accessible name from
            <Typography.InlineCode>Popover.Title</Typography.InlineCode>, so include one or pass
            <Typography.InlineCode>aria-label</Typography.InlineCode>.
        </Typography.Text>
        <Typography.Text variant="supporting">
            While a popover is open, the rest of the page is inert unless
            <Typography.InlineCode>hoverable</Typography.InlineCode>
            is set. Set
            <Typography.InlineCode>{'inert={false}'}</Typography.InlineCode>
            on <Typography.InlineCode>Popover.Root</Typography.InlineCode> only when the surrounding
            page must remain interactive.
        </Typography.Text>
        <CodeBlock
            code={`import * as Popover from '@sivir-ui/svelte/components/popover';\nimport { Textarea } from '@sivir-ui/svelte/components/textarea';\n\n<Popover.Root>\n  <Popover.Trigger>Feedback</Popover.Trigger>\n  <Popover.Content class="w-80">\n    <Popover.Title>Send feedback</Popover.Title>\n    <Textarea placeholder="What’s working, and what isn’t?" />\n  </Popover.Content>\n</Popover.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <!-- Basic popover -->
        <div id="basic" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Basic popover</Typography.H3>
            <ComponentPreview code={BasicSrc}>
                <Basic />
            </ComponentPreview>
        </div>

        <!-- Placement variants -->
        <div id="placements" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Placement variants</Typography.H3>
            <ComponentPreview code={PlacementsSrc}>
                <Placements />
            </ComponentPreview>
        </div>
    </section>
</div>
