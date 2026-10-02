<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Definition from './examples/definition.svelte';
    import DefinitionSrc from './examples/definition.svelte?raw';
    import LinkPreview from './examples/link-preview.svelte';
    import LinkPreviewSrc from './examples/link-preview.svelte?raw';
    import UserPreview from './examples/user-preview.svelte';
    import UserPreviewSrc from './examples/user-preview.svelte?raw';

    const _TITLE = 'Hover Card';
    const SLUG = 'hover-card';

    const installCommand = `bunx --package @sivir-ui/svelte sivir add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · Hover Card</title>
    <meta
        name="description"
        content="A preview card that opens when you hover or focus a link, mention, or term."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Hover Card </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Opens 200 ms after the pointer or focus reaches the trigger and closes 150 ms after
                it leaves. Give the trigger an
                <Typography.InlineCode>href</Typography.InlineCode>
                to render it as a link.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={UserPreviewSrc}>
            <UserPreview />
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
            Position the card with <Typography.InlineCode>side</Typography.InlineCode> (default
            <Typography.InlineCode>bottom</Typography.InlineCode>) and
            <Typography.InlineCode>align</Typography.InlineCode>
            (default
            <Typography.InlineCode>center</Typography.InlineCode>) on
            <Typography.InlineCode>HoverCard.Content</Typography.InlineCode>. Change the delays with
            <Typography.InlineCode>openDelay</Typography.InlineCode>
            and
            <Typography.InlineCode>closeDelay</Typography.InlineCode>
            on Root.
        </Typography.Text>
        <CodeBlock
            code={`import * as HoverCard from '@sivir-ui/svelte/components/hover-card';\n\n<HoverCard.Root>\n  <HoverCard.Trigger href="/u/mara">@mara</HoverCard.Trigger>\n  <HoverCard.Content>\n    <HoverCard.Title>Mara Lindqvist</HoverCard.Title>\n    <HoverCard.Description>Design engineer on the payments team.</HoverCard.Description>\n  </HoverCard.Content>\n</HoverCard.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <!-- User mention preview -->
        <div id="user-preview" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> User mention preview </Typography.H3>
            <ComponentPreview code={UserPreviewSrc}>
                <UserPreview />
            </ComponentPreview>
        </div>

        <!-- Link preview -->
        <div id="link-preview" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Link preview </Typography.H3>
            <ComponentPreview code={LinkPreviewSrc}>
                <LinkPreview />
            </ComponentPreview>
        </div>

        <!-- Simple definition -->
        <div id="definition" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Definition </Typography.H3>
            <ComponentPreview code={DefinitionSrc}>
                <Definition />
            </ComponentPreview>
        </div>
    </section>
</div>
