<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import type { GaugeSize, GaugeTone } from '@sivir-ui/svelte/components/gauge';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewMorph,
        PreviewOptions,
        PropGroup,
        PropRow,
        PropSegmented
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import ContextWindow from './examples/context-window.svelte';
    import ContextWindowSrc from './examples/context-window.svelte?raw';
    import LiveUpdates from './examples/live-updates.svelte';
    import LiveUpdatesSrc from './examples/live-updates.svelte?raw';
    import Sizes from './examples/sizes.svelte';
    import SizesSrc from './examples/sizes.svelte?raw';
    import UsageLimit from './examples/usage-limit.svelte';
    import UsageLimitSrc from './examples/usage-limit.svelte?raw';
    import {
        changedGaugeProps,
        type GaugeSettings,
        type GaugeValueOption,
        gaugeCode,
        gaugeDefaults
    } from './playground/playground';
    import Preview from './playground/preview.svelte';

    const TITLE = 'Gauge';
    const SLUG = 'gauge';
    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    const valueOptions: {
        value: GaugeValueOption;
        label: string;
    }[] = [
        {
            value: '24',
            label: '24'
        },
        {
            value: '58',
            label: '58'
        },
        {
            value: '85',
            label: '85'
        },
        {
            value: '100',
            label: '100'
        }
    ];
    const toneOptions: {
        value: GaugeTone;
        label: string;
    }[] = [
        {
            value: 'primary',
            label: 'Primary'
        },
        {
            value: 'muted',
            label: 'Muted'
        },
        {
            value: 'success',
            label: 'Success'
        },
        {
            value: 'warning',
            label: 'Warning'
        },
        {
            value: 'error',
            label: 'Error'
        }
    ];
    const sizeOptions: {
        value: GaugeSize;
        label: string;
    }[] = [
        {
            value: 'sm',
            label: 'Small'
        },
        {
            value: 'md',
            label: 'Medium'
        },
        {
            value: 'lg',
            label: 'Large'
        }
    ];

    let settings = $state<GaugeSettings>({
        ...gaugeDefaults
    });

    const heroCode = $derived(gaugeCode(settings));
    const changed = $derived(changedGaugeProps(settings));
    const usageCode = `import * as Gauge from '@sivir-ui/svelte/components/gauge';

<Gauge.Root value={72} label="Monthly API usage" tone="warning">
  <Gauge.Track />
  <Gauge.Indicator />
  <Gauge.Value>
    {#snippet children({ percent })}
      {percent}%
    {/snippet}
  </Gauge.Value>
</Gauge.Root>`;
</script>

{#snippet toneControl()}
    <PreviewOptions label="Tone" options={toneOptions} bind:value={settings.tone} />
{/snippet}

{#snippet heroProps()}
    <PropGroup title="Reading">
        <PropRow label="Value">
            <PropSegmented
                label="Value"
                size="sm"
                options={valueOptions}
                bind:value={settings.value}
            />
        </PropRow>
    </PropGroup>
    <PropGroup title="Appearance">
        <PropRow label="Size">
            <PropSegmented
                label="Size"
                size="sm"
                options={sizeOptions}
                bind:value={settings.size}
            />
        </PropRow>
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="An arc meter for a value out of a maximum, such as context used or API usage."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                An open arc that fills to value out of max, with the reading in its center. When the
                value changes, the arc sweeps and the number counts to it together.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} controls={toneControl} props={heroProps} {changed}>
            <PreviewMorph key={settings.size}>
                <Preview {settings} />
            </PreviewMorph>
        </ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            <Typography.InlineCode>value</Typography.InlineCode>
            is required;
            <Typography.InlineCode>max</Typography.InlineCode>
            defaults to 100,
            <Typography.InlineCode>size</Typography.InlineCode>
            to md, and
            <Typography.InlineCode>tone</Typography.InlineCode>
            to primary. Without
            <Typography.InlineCode>label</Typography.InlineCode>, screen readers announce the meter
            as "72 of 100", so pass a label that says what it measures.
        </Typography.Text>
        <Typography.Text variant="supporting">
            Gauge.Root on its own renders Track, Indicator, and Value. Compose the parts yourself to
            restyle or leave one out. Gauge.Value shows the whole percent by default; its children
            snippet receives the animated
            <Typography.InlineCode>value</Typography.InlineCode>,
            <Typography.InlineCode>max</Typography.InlineCode>, and
            <Typography.InlineCode>percent</Typography.InlineCode>. The percent reads 0 or 100 only
            at the bounds.
        </Typography.Text>
        <CodeBlock code={usageCode} lang="svelte" copy="overlay" />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="live-updates" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Live updates </Typography.H3>
            <Typography.Text variant="supporting">
                Changes sweep over
                <Typography.InlineCode>--motion-duration-gauge</Typography.InlineCode>
                (480ms by default) and snap when reduced motion is on. Switch tone at your own
                thresholds to warn as the limit gets close.
            </Typography.Text>
            <ComponentPreview code={LiveUpdatesSrc}>
                <LiveUpdates />
            </ComponentPreview>
        </div>

        <div id="sizes" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Sizes </Typography.H3>
            <Typography.Text variant="supporting">
                sm is 20px, md is 32px, and lg is 56px. Root leaves Value out at sm, where the
                number would be too small to read.
            </Typography.Text>
            <ComponentPreview code={SizesSrc}>
                <Sizes />
            </ComponentPreview>
        </div>

        <div id="context-window" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Context window </Typography.H3>
            <Typography.Text variant="supporting">
                At sm, put the reading in text beside the gauge.
            </Typography.Text>
            <ComponentPreview code={ContextWindowSrc}>
                <ContextWindow />
            </ComponentPreview>
        </div>

        <div id="usage-limit" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Usage limit </Typography.H3>
            <Typography.Text variant="supporting">
                Set max to the limit and format the center with the Value snippet.
            </Typography.Text>
            <ComponentPreview code={UsageLimitSrc}>
                <UsageLimit />
            </ComponentPreview>
        </div>
    </section>
</div>
