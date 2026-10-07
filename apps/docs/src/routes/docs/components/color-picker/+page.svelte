<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import type { ColorFormat } from '@sivir-ui/svelte/components/color-picker';
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
    import Default from './examples/default.svelte';
    import DefaultSrc from './examples/default.svelte?raw';
    import Formats from './examples/formats.svelte';
    import FormatsSrc from './examples/formats.svelte?raw';
    import Hero from './examples/hero.svelte';
    import WithPresets from './examples/with-presets.svelte';
    import WithPresetsSrc from './examples/with-presets.svelte?raw';
    import {
        type ColorPickerSettings,
        type ColorPickerTriggerVariant,
        changedColorPickerProps,
        colorPickerCode,
        colorPickerDefaults
    } from './playground/playground';

    type Option<T extends string> = {
        value: T;
        label: string;
    };

    const TITLE = 'Color Picker';
    const SLUG = 'color-picker';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    const variantOptions: Option<ColorPickerTriggerVariant>[] = [
        {
            value: 'outline',
            label: 'Outline'
        },
        {
            value: 'secondary',
            label: 'Secondary'
        },
        {
            value: 'ghost',
            label: 'Ghost'
        }
    ];

    const formatOptions: Option<ColorFormat>[] = [
        {
            value: 'hsl',
            label: 'HSL'
        },
        {
            value: 'rgb',
            label: 'RGB'
        },
        {
            value: 'hsv',
            label: 'HSV'
        }
    ];

    let settings = $state<ColorPickerSettings>({
        ...colorPickerDefaults
    });
    let color = $state('#5e6ad2');

    const heroCode = $derived(colorPickerCode(settings));
    const changed = $derived(changedColorPickerProps(settings));
</script>

{#snippet heroControls()}
    <PreviewOptions label="Variant" options={variantOptions} bind:value={settings.variant} />
{/snippet}

{#snippet heroProps()}
    <PropGroup title="Content">
        <PropSwitch label="Label" bind:checked={settings.label} />
        <PropSwitch label="Preset swatches" bind:checked={settings.presets} />
    </PropGroup>
    <PropGroup title="Behavior">
        <PropRow label="Format">
            <PropSegmented label="Format" options={formatOptions} bind:value={settings.format} />
        </PropRow>
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A popover color picker that edits a hex value, with optional preset swatches."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                The trigger opens a popover with a color area, hue strip, hex field, and channel
                sliders. Edits come back as a lowercase hex string.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} controls={heroControls} props={heroProps} {changed}>
            <PreviewMorph key={`${settings.variant}-${settings.label}`}>
                <Hero
                    bind:color
                    variant={settings.variant}
                    format={settings.format}
                    label={settings.label}
                    presets={settings.presets}
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
            Bind <Typography.InlineCode>value</Typography.InlineCode> on Root, or pass
            <Typography.InlineCode>value</Typography.InlineCode>
            with
            <Typography.InlineCode>onValueChange</Typography.InlineCode>.
            <Typography.InlineCode>format</Typography.InlineCode>
            picks the slider set:
            <Typography.InlineCode>hsl</Typography.InlineCode>
            (default),
            <Typography.InlineCode>rgb</Typography.InlineCode>, or
            <Typography.InlineCode>hsv</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock
            code={`import * as ColorPicker from '@sivir-ui/svelte/components/color-picker';\n\nlet value = $state('#5e6ad2');\n\n<ColorPicker.Root bind:value format="hsl">\n\t<ColorPicker.Trigger />\n\t<ColorPicker.Content />\n</ColorPicker.Root>`}
            lang="svelte"
            copy="overlay"
        />
        <Typography.Text variant="supporting">
            Opening the picker focuses the color area, not the hex field. Arrow keys move the color
            area and hue strip, and Shift moves them in steps of 10. In browsers that support the
            EyeDropper API, the pipette button in the hex field picks a color from anywhere on
            screen.
        </Typography.Text>
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="default" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Default </Typography.H3>
            <ComponentPreview code={DefaultSrc}>
                <Default />
            </ComponentPreview>
        </div>

        <div id="formats" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Channel formats </Typography.H3>
            <ComponentPreview code={FormatsSrc}>
                <Formats />
            </ComponentPreview>
        </div>

        <div id="with-presets" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With preset swatches </Typography.H3>
            <ComponentPreview code={WithPresetsSrc}>
                <WithPresets />
            </ComponentPreview>
        </div>
    </section>
</div>
