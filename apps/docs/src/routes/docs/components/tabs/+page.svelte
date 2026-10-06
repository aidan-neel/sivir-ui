<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import type { TabsVariant } from '@sivir-ui/svelte/components/tabs';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewMorph,
        PreviewOptions,
        PropGroup,
        PropRow,
        PropSegmented,
        PropSwitch
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import Vertical from './examples/vertical.svelte';
    import VerticalSrc from './examples/vertical.svelte?raw';
    import {
        changedTabsProps,
        type TabsOrientation,
        type TabsSettings,
        tabsCode,
        tabsDefaults
    } from './playground/playground';

    const installCommand = 'bunx @sivir-ui/svelte add tabs';

    const variantOptions: {
        value: TabsVariant;
        label: string;
    }[] = [
        {
            value: 'default',
            label: 'Default'
        },
        {
            value: 'ghost',
            label: 'Ghost'
        },
        {
            value: 'segmented',
            label: 'Segmented'
        }
    ];

    const orientationOptions: {
        value: TabsOrientation;
        label: string;
    }[] = [
        {
            value: 'horizontal',
            label: 'Horizontal'
        },
        {
            value: 'vertical',
            label: 'Vertical'
        }
    ];

    let settings = $state<TabsSettings>({
        ...tabsDefaults
    });

    const heroCode = $derived(tabsCode(settings));
    const changed = $derived(changedTabsProps(settings));
    const morphKey = $derived(`${settings.variant}-${settings.orientation}`);
    const heroWidth = $derived(settings.orientation === 'horizontal' ? 'w-96 max-w-full' : '');
</script>

{#snippet heroControls()}
    <PreviewOptions label="Variant" options={variantOptions} bind:value={settings.variant} />
{/snippet}

{#snippet heroProps()}
    <PropGroup title="Layout">
        <PropRow label="Orientation">
            <PropSegmented
                label="Orientation"
                size="sm"
                options={orientationOptions}
                bind:value={settings.orientation}
            />
        </PropRow>
    </PropGroup>
    <PropGroup title="State">
        <PropSwitch label="Disabled tab" bind:checked={settings.disabledTab} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · Tabs</title>
    <meta
        name="description"
        content="Tabs that switch between related panels, with a sliding indicator and horizontal or vertical layout."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Tabs </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Shows one panel at a time from a set of related views. Set
                <Typography.InlineCode>variant</Typography.InlineCode>
                to default, ghost, or segmented.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} controls={heroControls} props={heroProps} {changed}>
            <PreviewMorph key={morphKey}>
                <div class={heroWidth}>
                    <Hero
                        variant={settings.variant}
                        orientation={settings.orientation}
                        disabledTab={settings.disabledTab}
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
            Bind <Typography.InlineCode>value</Typography.InlineCode> on Root to the
            <Typography.InlineCode>value</Typography.InlineCode>
            of the selected Trigger and Content. It defaults to an empty string, so no tab is
            selected until you set it.
        </Typography.Text>
        <CodeBlock
            code={`import * as Tabs from '@sivir-ui/svelte/components/tabs';\n\nlet tab = $state('overview');\n\n<Tabs.Root bind:value={tab}>\n  <Tabs.List>\n    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>\n    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>\n  </Tabs.List>\n  <Tabs.Content value="overview">3 open issues, 12 closed this week.</Tabs.Content>\n  <Tabs.Content value="activity">Maya merged #482 two hours ago.</Tabs.Content>\n</Tabs.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Example Descriptions ─────────────────────────────────────── -->
    {#snippet orientationVerticalDescription()}
        <Typography.Text variant="supporting">
            Set <Typography.InlineCode>orientation="vertical"</Typography.InlineCode> to place the
            list beside the panels. Arrow keys follow the orientation: Left and Right for horizontal
            tabs, Up and Down for vertical. They select the next enabled tab and wrap at the ends.
            Home and End select the first and last tab.
        </Typography.Text>
    {/snippet}

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="orientation-vertical" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Vertical </Typography.H3>
            <ComponentPreview code={VerticalSrc}>
                <Vertical />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render orientationVerticalDescription()}
            </div>
        </div>
    </section>
</div>
