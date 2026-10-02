<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Capped from './examples/capped.svelte';
    import CappedSrc from './examples/capped.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const TITLE = 'Show More';
    const installCommand = 'bunx --package @sivir-ui/svelte sivir add show-more';
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta name="description" content="Clamp long content and reveal the rest on demand." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Clamps content to a set number of lines and expands it in place. The toggle renders
                only when the content is taller than the clamp.
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
            <Typography.InlineCode>lines</Typography.InlineCode>
            sets the collapsed height and defaults to 3. Expanded content taller than
            <Typography.InlineCode>maxHeight</Typography.InlineCode>
            (320px by default) scrolls, and
            <Typography.InlineCode>label</Typography.InlineCode>
            names that scroll region. Bind
            <Typography.InlineCode>expanded</Typography.InlineCode>
            when another control needs to coordinate the state.
        </Typography.Text>
        <CodeBlock
            code={`import { ShowMore } from '@sivir-ui/svelte/components/show-more';

let expanded = $state(false);

<ShowMore bind:expanded lines={3} label="Release notes">
  <p>Version 2.4 adds offline drafts, faster search across archived threads, and a fix for attachments failing to upload on slow connections.</p>
</ShowMore>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <div id="capped" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Capped content</Typography.H3>
            <Typography.Text variant="supporting">
                When expanded content exceeds
                <Typography.InlineCode>maxHeight</Typography.InlineCode>, it becomes a
                keyboard-focusable scroll region.
            </Typography.Text>
            <ComponentPreview code={CappedSrc}>
                <Capped />
            </ComponentPreview>
        </div>
    </section>
</div>
