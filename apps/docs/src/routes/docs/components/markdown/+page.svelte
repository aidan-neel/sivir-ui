<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import SafeHtml from './examples/safe-html.svelte';
    import SafeHtmlSrc from './examples/safe-html.svelte?raw';
    import Streaming from './examples/streaming.svelte';
    import StreamingSrc from './examples/streaming.svelte?raw';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add markdown';
    const usageSnippet = `import { Markdown } from '@sivir-ui/svelte/components/markdown';

const content = [
  '## Result',
  '',
  '| File | Status |',
  '| --- | --- |',
  '| app.ts | Updated |',
  '',
  '- [x] Run checks'
].join('\\n');

<Markdown {content} />`;
</script>

<svelte:head>
    <title>Sivir · Markdown</title>
    <meta
        name="description"
        content="Renders GitHub-flavored Markdown from model output and shows raw HTML as text."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Markdown </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Fenced code renders in a Sivir code block with syntax highlighting. External links
                open in a new tab. Links with schemes other than http, https, and mailto render as
                plain text.
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
            Pass the Markdown string as <Typography.InlineCode>content</Typography.InlineCode>.
            Tables, task lists, and strikethrough are supported. Raw HTML is displayed as text, and
            images load only from relative URLs; other images show their alt text. Set
            <Typography.InlineCode>streaming</Typography.InlineCode>
            while chunks are arriving to show a caret and mark the output busy.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="streaming" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Streaming response </Typography.H3>
            <ComponentPreview code={StreamingSrc}><Streaming /></ComponentPreview>
        </div>

        <div id="safe-html" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Raw HTML safety </Typography.H3>
            <ComponentPreview code={SafeHtmlSrc}><SafeHtml /></ComponentPreview>
        </div>
    </section>
</div>
