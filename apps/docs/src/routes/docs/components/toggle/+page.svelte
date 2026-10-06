<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
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
    import Disabled from './examples/disabled.svelte';
    import DisabledSrc from './examples/disabled.svelte?raw';
    import Hero from './examples/hero.svelte';
    import Icon from './examples/icon.svelte';
    import IconSrc from './examples/icon.svelte?raw';
    import Sizes from './examples/sizes.svelte';
    import SizesSrc from './examples/sizes.svelte?raw';
    import Text from './examples/text.svelte';
    import TextSrc from './examples/text.svelte?raw';
    import {
        changedToggleProps,
        type ToggleSettings,
        type ToggleSize,
        type ToggleVariant,
        toggleCode,
        toggleDefaults
    } from './playground/playground';

    const TITLE = 'Toggle';
    const SLUG = 'toggle';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    const variantOptions: {
        value: ToggleVariant;
        label: string;
    }[] = [
        {
            value: 'default',
            label: 'Default'
        },
        {
            value: 'outline',
            label: 'Outline'
        }
    ];

    const sizeOptions: {
        value: ToggleSize;
        label: string;
    }[] = [
        {
            value: 'sm',
            label: 'Small'
        },
        {
            value: 'md',
            label: 'Default'
        },
        {
            value: 'lg',
            label: 'Large'
        }
    ];

    let settings = $state<ToggleSettings>({
        ...toggleDefaults
    });

    const heroCode = $derived(toggleCode(settings));
    const changed = $derived(changedToggleProps(settings));
</script>

{#snippet heroControls()}
    <PreviewOptions label="Variant" options={variantOptions} bind:value={settings.variant} />
{/snippet}

{#snippet heroProps()}
    <PropGroup title="Appearance">
        <PropRow label="Size">
            <PropSegmented label="Size" options={sizeOptions} bind:value={settings.size} />
        </PropRow>
    </PropGroup>
    <PropGroup title="State">
        <PropSwitch label="Pressed" bind:checked={settings.pressed} />
        <PropSwitch label="Disabled" bind:checked={settings.disabled} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A button that holds a pressed or unpressed state and reports it with aria-pressed."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Each click flips <Typography.InlineCode>pressed</Typography.InlineCode> and sets
                aria-pressed on the button. Bind the state or listen with
                <Typography.InlineCode>onPressedChange</Typography.InlineCode>.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} controls={heroControls} props={heroProps} {changed}>
            <PreviewMorph key={`${settings.variant}-${settings.size}`}>
                <Hero
                    variant={settings.variant}
                    size={settings.size}
                    disabled={settings.disabled}
                    bind:pressed={settings.pressed}
                />
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
            Bind <Typography.InlineCode>pressed</Typography.InlineCode> (defaults to false), or pass
            <Typography.InlineCode>onPressedChange</Typography.InlineCode>. Icon-only toggles need
            an
            <Typography.InlineCode>aria-label</Typography.InlineCode>.
            <Typography.InlineCode>variant="outline"</Typography.InlineCode>
            adds a border.
        </Typography.Text>
        <CodeBlock
            code={`import { Toggle } from '@sivir-ui/svelte/components/toggle';\nimport Bold from '@lucide/svelte/icons/bold';\n\nlet bold = $state(false);\n\n<Toggle bind:pressed={bold} aria-label="Bold">\n  <Bold size={14} />\n</Toggle>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="icon" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Icon toggle </Typography.H3>
            <ComponentPreview code={IconSrc}>
                <Icon />
            </ComponentPreview>
        </div>

        <div id="text" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Text toggle </Typography.H3>
            <ComponentPreview code={TextSrc}>
                <Text />
            </ComponentPreview>
        </div>

        <div id="sizes" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Sizes </Typography.H3>
            <ComponentPreview code={SizesSrc}>
                <Sizes />
            </ComponentPreview>
        </div>

        <div id="disabled" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Disabled </Typography.H3>
            <ComponentPreview code={DisabledSrc}>
                <Disabled />
            </ComponentPreview>
        </div>
    </section>
</div>
