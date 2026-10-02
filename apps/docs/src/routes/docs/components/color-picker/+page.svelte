<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Default from './examples/default.svelte';
    import DefaultSrc from './examples/default.svelte?raw';
    import Formats from './examples/formats.svelte';
    import FormatsSrc from './examples/formats.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import WithPresets from './examples/with-presets.svelte';
    import WithPresetsSrc from './examples/with-presets.svelte?raw';

    const TITLE = 'Color Picker';
    const SLUG = 'color-picker';

    const installCommand = `bunx --package @sivir-ui/svelte sivir add ${SLUG}`;
</script>

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

        <!-- Default -->
        <div id="default" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Default </Typography.H3>
            <ComponentPreview code={DefaultSrc}>
                <Default />
            </ComponentPreview>
        </div>

        <!-- Channel formats -->
        <div id="formats" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Channel formats </Typography.H3>
            <ComponentPreview code={FormatsSrc}>
                <Formats />
            </ComponentPreview>
        </div>

        <!-- With presets -->
        <div id="with-presets" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With preset swatches </Typography.H3>
            <ComponentPreview code={WithPresetsSrc}>
                <WithPresets />
            </ComponentPreview>
        </div>
    </section>
</div>
