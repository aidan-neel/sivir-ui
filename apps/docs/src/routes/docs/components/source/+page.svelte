<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Citation from './examples/citation.svelte';
    import CitationSrc from './examples/citation.svelte?raw';
    import Fallback from './examples/fallback.svelte';
    import FallbackSrc from './examples/fallback.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Multiple from './examples/multiple.svelte';
    import MultipleSrc from './examples/multiple.svelte?raw';

    const TITLE = 'Source';
    const SLUG = 'source';
    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A favicon link chip for a page the model read, with an optional card of cited pages."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A small link chip with a favicon and a label for a page the model searched, read, or
                cited. Use it in a reasoning step to show what was read, or inline after a claim
                with a card that previews the cited pages.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            <Typography.InlineCode>Root</Typography.InlineCode>
            is a link, so <Typography.InlineCode>href</Typography.InlineCode> is required. Absolute
            http and https links open in a new tab unless you set
            <Typography.InlineCode>target</Typography.InlineCode>.
            <Typography.InlineCode>Icon</Typography.InlineCode>
            shows the favicon from
            <Typography.InlineCode>src</Typography.InlineCode>, which can be any image URL, such as
            one your search backend returns, and
            <Typography.InlineCode>Label</Typography.InlineCode>
            truncates long names.
        </Typography.Text>
        <CodeBlock
            code={`import * as Source from '@sivir-ui/svelte/components/source';

<Source.Root href="https://web.dev/articles/optimize-inp">
  <Source.Icon src="/favicons/web.dev.png" fallback="web.dev" />
  <Source.Label>web.dev</Source.Label>
</Source.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="citations" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Citations</Typography.H2>
        <Typography.Text variant="supporting">
            Place <Typography.InlineCode>Root</Typography.InlineCode> inside the paragraph, right
            after the sentence it supports. There the chip tightens to sit on the text line. Add a
            <Typography.InlineCode>Content</Typography.InlineCode>
            and the chip opens it on hover and focus. Put one
            <Typography.InlineCode>Item</Typography.InlineCode>
            in it per cited page, each with an
            <Typography.InlineCode>Icon</Typography.InlineCode>,
            <Typography.InlineCode>Label</Typography.InlineCode>,
            <Typography.InlineCode>Title</Typography.InlineCode>, and an optional
            <Typography.InlineCode>Description</Typography.InlineCode>. Content renders only in the
            browser, so it is safe inside a
            <Typography.InlineCode>&lt;p&gt;</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock
            code={`<p>
  Keep the main thread free so input stays responsive.
  <Source.Root href="https://web.dev/articles/optimize-inp">
    <Source.Icon src="/favicons/web.dev.png" fallback="web.dev" />
    <Source.Label>web.dev</Source.Label>
    <Source.Content>
      <Source.Item href="https://web.dev/articles/optimize-inp">
        <Source.Icon src="/favicons/web.dev.png" fallback="web.dev" />
        <Source.Label>web.dev</Source.Label>
        <Source.Title>Optimize Interaction to Next Paint</Source.Title>
        <Source.Description>Keeping the main thread free.</Source.Description>
      </Source.Item>
    </Source.Content>
  </Source.Root>
</p>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <div id="missing-icons" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Missing icons</Typography.H3>
            <Typography.Text variant="supporting">
                When <Typography.InlineCode>src</Typography.InlineCode> is missing or fails to load,
                the icon shows the first letter of
                <Typography.InlineCode>fallback</Typography.InlineCode>, or a globe without one.
            </Typography.Text>
            <ComponentPreview code={FallbackSrc}>
                <Fallback />
            </ComponentPreview>
        </div>

        <div id="inline-citation" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Inline citation</Typography.H3>
            <Typography.Text variant="supporting">
                Hover or focus the chip to preview the cited page.
            </Typography.Text>
            <ComponentPreview code={CitationSrc}>
                <Citation />
            </ComponentPreview>
        </div>

        <div id="multiple-sources" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Multiple sources</Typography.H3>
            <Typography.Text variant="supporting">
                Set <Typography.InlineCode>count</Typography.InlineCode> on
                <Typography.InlineCode>Root</Typography.InlineCode>
                to the number of cited pages, and
                <Typography.InlineCode>Count</Typography.InlineCode>
                shows how many follow the first, such as +1. Count reads the prop, because the
                card's items are not mounted until it opens.
            </Typography.Text>
            <ComponentPreview code={MultipleSrc}>
                <Multiple />
            </ComponentPreview>
        </div>
    </section>
</div>
