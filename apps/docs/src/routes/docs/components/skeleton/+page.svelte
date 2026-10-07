<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewMorph,
        PropGroup,
        PropRow,
        PropSegmented
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Card from './examples/card.svelte';
    import CardSrc from './examples/card.svelte?raw';
    import Circle from './examples/circle.svelte';
    import CircleSrc from './examples/circle.svelte?raw';
    import Hero from './examples/hero.svelte';
    import Rectangle from './examples/rectangle.svelte';
    import RectangleSrc from './examples/rectangle.svelte?raw';
    import {
        changedSkeletonProps,
        type SkeletonBarHeight,
        type SkeletonDelay,
        type SkeletonLines,
        type SkeletonSettings,
        skeletonCode,
        skeletonDefaults
    } from './playground/playground';

    const TITLE = 'Skeleton';

    const installCommand = 'bunx @sivir-ui/svelte add skeleton';

    const lineOptions: {
        value: SkeletonLines;
        label: string;
    }[] = [
        {
            value: '2',
            label: '2'
        },
        {
            value: '3',
            label: '3'
        },
        {
            value: '4',
            label: '4'
        }
    ];

    const barHeightOptions: {
        value: SkeletonBarHeight;
        label: string;
    }[] = [
        {
            value: '6',
            label: '6'
        },
        {
            value: '9',
            label: '9'
        },
        {
            value: '12',
            label: '12'
        }
    ];

    const delayOptions: {
        value: SkeletonDelay;
        label: string;
    }[] = [
        {
            value: '0',
            label: '0ms'
        },
        {
            value: '120',
            label: '120ms'
        },
        {
            value: '1000',
            label: '1s'
        }
    ];

    let settings = $state<SkeletonSettings>({
        ...skeletonDefaults
    });

    const heroCode = $derived(skeletonCode(settings));
    const changed = $derived(changedSkeletonProps(settings));
    const morphKey = $derived(`${settings.lines}-${settings.barHeight}-${settings.delay}`);
</script>

{#snippet heroProps()}
    <PropGroup title="Layout">
        <PropRow label="Lines">
            <PropSegmented
                label="Lines"
                size="sm"
                options={lineOptions}
                bind:value={settings.lines}
            />
        </PropRow>
        <PropRow label="Bar height">
            <PropSegmented
                label="Bar height"
                size="sm"
                options={barHeightOptions}
                bind:value={settings.barHeight}
            />
        </PropRow>
    </PropGroup>
    <PropGroup title="Timing">
        <PropRow label="Delay">
            <PropSegmented
                label="Delay"
                size="sm"
                options={delayOptions}
                bind:value={settings.delay}
            />
        </PropRow>
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="Loading placeholders that reserve the content's height and skip the flash on fast loads."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                SkeletonSwap waits 120ms before showing its placeholder and then keeps it up for at
                least 380ms, so fast loads skip it and slow ones don't flash. Skeleton is a static
                block for building your own placeholder.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={heroProps} {changed} refreshable>
            <PreviewMorph key={morphKey}>
                <div class="w-96 max-w-full">
                    <Hero
                        lines={Number(settings.lines)}
                        barHeight={Number(settings.barHeight)}
                        delay={Number(settings.delay)}
                    />
                </div>
            </PreviewMorph>
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
            Set <Typography.InlineCode>ready</Typography.InlineCode> when the data arrives. The box
            is <Typography.InlineCode>lines</Typography.InlineCode> ×
            <Typography.InlineCode>lineHeight</Typography.InlineCode>
            tall (3 × 21px by default), or pass
            <Typography.InlineCode>reserve</Typography.InlineCode>
            for a fixed pixel height. Taller content scrolls inside it. With
            <Typography.InlineCode>label</Typography.InlineCode>, screen readers hear "Profile
            loaded" when the content appears.
        </Typography.Text>
        <CodeBlock
            code={`import { SkeletonSwap } from '@sivir-ui/svelte/components/skeleton';

<SkeletonSwap ready={profile !== null} lines={3} label="Profile">
  {#if profile}<p>{profile.bio}</p>{/if}
</SkeletonSwap>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                These use <Typography.InlineCode>Skeleton</Typography.InlineCode>, which takes
                <Typography.InlineCode>w</Typography.InlineCode>
                and
                <Typography.InlineCode>h</Typography.InlineCode>
                in px unless you set
                <Typography.InlineCode>unit</Typography.InlineCode>. Pass Skeleton blocks to the
                SkeletonSwap <Typography.InlineCode>skeleton</Typography.InlineCode> snippet to
                replace its default bars.
            </Typography.Text>
        </div>

        <!-- Rectangle -->
        <div id="rectangle" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Rectangle</Typography.H3>
            <ComponentPreview code={RectangleSrc}>
                <Rectangle />
            </ComponentPreview>
        </div>

        <!-- Circle -->
        <div id="circle" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Circle</Typography.H3>
            <ComponentPreview code={CircleSrc}>
                <Circle />
            </ComponentPreview>
        </div>

        <!-- Card composition -->
        <div id="card" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Card composition</Typography.H3>
            <ComponentPreview code={CardSrc}>
                <Card />
            </ComponentPreview>
        </div>
    </section>
</div>
