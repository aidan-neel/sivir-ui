<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PropGroup,
        PropRow,
        PropSegmented
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import {
        changedHoverCardProps,
        type HoverCardAlign,
        type HoverCardCloseDelay,
        type HoverCardOpenDelay,
        type HoverCardSettings,
        type HoverCardSide,
        hoverCardCode,
        hoverCardDefaults
    } from './playground/playground';
    import Preview from './playground/preview.svelte';

    type Option<T extends string> = {
        value: T;
        label: string;
    };

    const SLUG = 'hover-card';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    const sideOptions: Option<HoverCardSide>[] = [
        {
            value: 'top',
            label: 'Top'
        },
        {
            value: 'right',
            label: 'Right'
        },
        {
            value: 'bottom',
            label: 'Bottom'
        },
        {
            value: 'left',
            label: 'Left'
        }
    ];
    const alignOptions: Option<HoverCardAlign>[] = [
        {
            value: 'start',
            label: 'Start'
        },
        {
            value: 'center',
            label: 'Center'
        },
        {
            value: 'end',
            label: 'End'
        }
    ];
    const openDelayOptions: Option<HoverCardOpenDelay>[] = [
        {
            value: '0',
            label: '0 ms'
        },
        {
            value: '200',
            label: '200 ms'
        },
        {
            value: '500',
            label: '500 ms'
        }
    ];
    const closeDelayOptions: Option<HoverCardCloseDelay>[] = [
        {
            value: '0',
            label: '0 ms'
        },
        {
            value: '150',
            label: '150 ms'
        },
        {
            value: '500',
            label: '500 ms'
        }
    ];

    let settings = $state<HoverCardSettings>({
        ...hoverCardDefaults
    });

    const heroCode = $derived(hoverCardCode(settings));
    const changed = $derived(changedHoverCardProps(settings));
</script>

{#snippet hoverCardProps()}
    <PropGroup title="Placement">
        <PropRow label="Side">
            <PropSegmented
                label="Side"
                size="sm"
                options={sideOptions}
                bind:value={settings.side}
            />
        </PropRow>
        <PropRow label="Align">
            <PropSegmented
                label="Align"
                size="sm"
                options={alignOptions}
                bind:value={settings.align}
            />
        </PropRow>
    </PropGroup>
    <PropGroup title="Timing">
        <PropRow label="Open delay">
            <PropSegmented
                label="Open delay"
                size="sm"
                options={openDelayOptions}
                bind:value={settings.openDelay}
            />
        </PropRow>
        <PropRow label="Close delay">
            <PropSegmented
                label="Close delay"
                size="sm"
                options={closeDelayOptions}
                bind:value={settings.closeDelay}
            />
        </PropRow>
    </PropGroup>
{/snippet}

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
        <ComponentPreview code={heroCode} props={hoverCardProps} {changed}>
            <Preview {settings} />
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
</div>
