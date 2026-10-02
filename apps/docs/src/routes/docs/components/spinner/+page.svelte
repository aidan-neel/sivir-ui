<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Pace from './examples/pace.svelte';
    import PaceSrc from './examples/pace.svelte?raw';
    import ReadyState from './examples/ready-state.svelte';
    import ReadyStateSrc from './examples/ready-state.svelte?raw';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add spinner';
</script>

<svelte:head>
    <title>Sivir · Spinner</title>
    <meta
        name="description"
        content="A spinning loader for work of unknown length that can resolve to a checkmark."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Spinner </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A rotating loader icon, 16px by default. Set size in pixels to match the text next
                to it.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Spinner has no role or live region. Put text next to it that describes the work, and set
            <Typography.InlineCode>aria-hidden</Typography.InlineCode>
            so screen readers skip the icon. Set
            <Typography.InlineCode>ready</Typography.InlineCode>
            when the work finishes.
        </Typography.Text>
        <CodeBlock
            code={`import { Spinner } from '@sivir-ui/svelte/components/spinner';\n\n<Spinner ready={saved} aria-hidden="true" />\n<span>{saved ? 'Saved' : 'Saving'}</span>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="pace" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Speed and curved rotation</Typography.H2>
        <Typography.Text variant="supporting">
            One turn takes 850ms; <Typography.InlineCode>speed</Typography.InlineCode> multiplies
            the rate, so a speed of 2 takes 425ms.
            <Typography.InlineCode>curved</Typography.InlineCode>
            speeds up and slows down within each turn instead of spinning at a constant rate.
        </Typography.Text>
        <ComponentPreview code={PaceSrc}><Pace /></ComponentPreview>
    </section>

    <section id="ready-state" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Completion state</Typography.H2>
        <Typography.Text variant="supporting">
            Set <Typography.InlineCode>ready</Typography.InlineCode> to true when the work succeeds.
            The spinner swaps to a checkmark, holds it for two seconds, then collapses and removes
            itself. Set <Typography.InlineCode>ready</Typography.InlineCode> back to false to show
            it again.
        </Typography.Text>
        <ComponentPreview code={ReadyStateSrc}><ReadyState /></ComponentPreview>
    </section>
</div>
