<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import AsLink from './examples/as-link.svelte';
    import AsLinkSrc from './examples/as-link.svelte?raw';
    import Disabled from './examples/disabled.svelte';
    import DisabledSrc from './examples/disabled.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import IconGroup from './examples/icon-group.svelte';
    import IconGroupSrc from './examples/icon-group.svelte?raw';
    import LeadingIcon from './examples/leading-icon.svelte';
    import LeadingIconSrc from './examples/leading-icon.svelte?raw';
    import Loading from './examples/loading.svelte';
    import LoadingSrc from './examples/loading.svelte?raw';
    import Sizes from './examples/sizes.svelte';
    import SizesSrc from './examples/sizes.svelte?raw';
    import TrailingIcon from './examples/trailing-icon.svelte';
    import TrailingIconSrc from './examples/trailing-icon.svelte?raw';
    import VariantDestructive from './examples/variant-destructive.svelte';
    import VariantDestructiveSrc from './examples/variant-destructive.svelte?raw';
    import VariantGhost from './examples/variant-ghost.svelte';
    import VariantGhostSrc from './examples/variant-ghost.svelte?raw';
    import VariantOutline from './examples/variant-outline.svelte';
    import VariantOutlineSrc from './examples/variant-outline.svelte?raw';
    import VariantPanel from './examples/variant-panel.svelte';
    import VariantPanelSrc from './examples/variant-panel.svelte?raw';
    import VariantPrimary from './examples/variant-primary.svelte';
    import VariantPrimarySrc from './examples/variant-primary.svelte?raw';
    import VariantQuiet from './examples/variant-quiet.svelte';
    import VariantQuietSrc from './examples/variant-quiet.svelte?raw';
    import VariantSecondary from './examples/variant-secondary.svelte';
    import VariantSecondarySrc from './examples/variant-secondary.svelte?raw';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add button';
</script>

<svelte:head>
    <title>Sivir · Button</title>
    <meta
        name="description"
        content="Displays an action or link with stable loading, success, and error states."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Button </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Renders a button element, or a link when you pass href. Defaults to the primary
                variant at medium size.
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
            Set <Typography.InlineCode>status</Typography.InlineCode> to
            <Typography.InlineCode>loading</Typography.InlineCode>,
            <Typography.InlineCode>success</Typography.InlineCode>, or
            <Typography.InlineCode>error</Typography.InlineCode>
            for async feedback, then back to
            <Typography.InlineCode>idle</Typography.InlineCode>. All labels share one grid cell, so
            the button keeps its width. Clicks are ignored while loading. The default labels are
            Loading…, Done, and Try again.
        </Typography.Text>
        <CodeBlock
            code={`import { Button } from '@sivir-ui/svelte/components/button';

let status: 'idle' | 'loading' | 'success' | 'error' = $state('idle');

<Button {status} loadingLabel="Publishing…" successLabel="Published">
  Publish
</Button>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <!-- Variants — each its own example piece -->
        <div id="variant-primary" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Primary </Typography.H3>
            <ComponentPreview code={VariantPrimarySrc}>
                <VariantPrimary />
            </ComponentPreview>
        </div>

        <div id="variant-secondary" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Secondary </Typography.H3>
            <ComponentPreview code={VariantSecondarySrc}>
                <VariantSecondary />
            </ComponentPreview>
        </div>

        <div id="variant-outline" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Outline </Typography.H3>
            <ComponentPreview code={VariantOutlineSrc}>
                <VariantOutline />
            </ComponentPreview>
        </div>

        <div id="variant-ghost" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Ghost </Typography.H3>
            <ComponentPreview code={VariantGhostSrc}>
                <VariantGhost />
            </ComponentPreview>
        </div>

        <div id="variant-quiet" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Quiet </Typography.H3>
            <ComponentPreview code={VariantQuietSrc}>
                <VariantQuiet />
            </ComponentPreview>
        </div>

        <div id="variant-destructive" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Destructive </Typography.H3>
            <ComponentPreview code={VariantDestructiveSrc}>
                <VariantDestructive />
            </ComponentPreview>
        </div>

        <div id="variant-panel" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Panel </Typography.H3>
            <ComponentPreview code={VariantPanelSrc}>
                <VariantPanel />
            </ComponentPreview>
        </div>

        <!-- Sizes (consolidated) -->
        <div id="sizes" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Sizes </Typography.H3>
            <ComponentPreview code={SizesSrc}>
                <Sizes />
            </ComponentPreview>
        </div>

        <!-- Disabled -->
        <div id="disabled" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Disabled </Typography.H3>
            <ComponentPreview code={DisabledSrc}>
                <Disabled />
            </ComponentPreview>
        </div>

        <!-- Composition -->
        <!-- Leading icon -->
        <div id="comp-leading" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Leading icon </Typography.H3>
            <ComponentPreview code={LeadingIconSrc}>
                <LeadingIcon />
            </ComponentPreview>
        </div>

        <!-- Trailing icon -->
        <div id="comp-trailing" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Trailing icon </Typography.H3>
            <ComponentPreview code={TrailingIconSrc}>
                <TrailingIcon />
            </ComponentPreview>
        </div>

        <!-- Loading -->
        <div id="comp-loading" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Status </Typography.H3>
            <ComponentPreview code={LoadingSrc}>
                <Loading />
            </ComponentPreview>
        </div>

        <!-- As link -->
        <div id="comp-link" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> As link </Typography.H3>
            <ComponentPreview code={AsLinkSrc}>
                <AsLink />
            </ComponentPreview>
        </div>

        <!-- Icon group -->
        <div id="comp-group" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Icon group </Typography.H3>
            <ComponentPreview code={IconGroupSrc}>
                <IconGroup />
            </ComponentPreview>
        </div>
    </section>
</div>
