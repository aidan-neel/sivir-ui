<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewMorph,
        PreviewOptions,
        PropGroup,
        PropSwitch
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import WithDot from './examples/with-dot.svelte';
    import WithDotSrc from './examples/with-dot.svelte?raw';
    import WithHref from './examples/with-href.svelte';
    import WithHrefSrc from './examples/with-href.svelte?raw';
    import WithIcon from './examples/with-icon.svelte';
    import WithIconSrc from './examples/with-icon.svelte?raw';
    import {
        type BadgeSettings,
        badgeCode,
        badgeDefaults,
        badgeText,
        badgeVariants,
        changedBadgeProps
    } from './playground/playground';

    const installCommand = 'bunx @sivir-ui/svelte add badge';

    let settings = $state<BadgeSettings>({
        ...badgeDefaults
    });

    const heroCode = $derived(badgeCode(settings));
    const changed = $derived(changedBadgeProps(settings));
    const morphKey = $derived(
        [settings.variant, settings.dot, settings.withIcon, settings.asLink].join('-')
    );
</script>

{#snippet heroControls()}
    <PreviewOptions label="Variant" options={badgeVariants} bind:value={settings.variant} />
{/snippet}

{#snippet heroProps()}
    <PropGroup title="Content">
        <PropSwitch label="Dot" bind:checked={settings.dot} />
        <PropSwitch label="Icon" bind:checked={settings.withIcon} />
    </PropGroup>
    <PropGroup title="Behavior">
        <PropSwitch label="Link" bind:checked={settings.asLink} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · Badge</title>
    <meta
        name="description"
        content="A small label for status, counts, and tags that can also render as a link."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Badge </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Pick one of nine variants. Set href to render an anchor instead of a div, dot to add
                a small marker before the text, or icon to add a leading icon.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} controls={heroControls} props={heroProps} {changed}>
            <PreviewMorph key={morphKey}>
                <Hero
                    variant={settings.variant}
                    label={badgeText(settings.variant)}
                    dot={settings.dot}
                    withIcon={settings.withIcon}
                    asLink={settings.asLink}
                />
            </PreviewMorph>
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
            variant defaults to secondary. icon takes a component such as a Lucide icon, sized by
            iconSize (13 by default).
        </Typography.Text>
        <CodeBlock
            code={`import { Badge } from '@sivir-ui/svelte/components/badge';\n\n<Badge>New</Badge>\n<Badge variant="outline" dot>Draft</Badge>\n<Badge variant="success">Active</Badge>\n<Badge variant="error">Failed</Badge>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="with-dot" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With dot </Typography.H3>
            <ComponentPreview code={WithDotSrc}>
                <WithDot />
            </ComponentPreview>
        </div>

        <div id="with-icon" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With icon </Typography.H3>
            <ComponentPreview code={WithIconSrc}>
                <WithIcon />
            </ComponentPreview>
        </div>

        <div id="with-href" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> As link </Typography.H3>
            <ComponentPreview code={WithHrefSrc}>
                <WithHref />
            </ComponentPreview>
        </div>
    </section>
</div>
