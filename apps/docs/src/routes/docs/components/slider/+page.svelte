<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Composed from './examples/composed.svelte';
    import ComposedSrc from './examples/composed.svelte?raw';
    import Disabled from './examples/disabled.svelte';
    import DisabledSrc from './examples/disabled.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Stepped from './examples/stepped.svelte';
    import SteppedSrc from './examples/stepped.svelte?raw';

    const TITLE = 'Slider';
    const SLUG = 'slider';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    const usage = `import { Slider } from '@sivir-ui/svelte/components/slider';

let opacity = $state(72);

<Slider
    bind:value={opacity}
    label="Opacity"
    format={(value) => \`\${value}%\`}
/>`;

    const composition = `import * as Slider from '@sivir-ui/svelte/components/slider';

let exposure = $state(0);

const format = (value) => \`\${value.toFixed(1)} EV\`;

<Slider.Root bind:value={exposure} min={-2} max={2} step={0.1} {format}>
    <Slider.Range />
    <Slider.Thumb />
    <Slider.Label>Exposure</Slider.Label>
    <Slider.Value />
</Slider.Root>`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A numeric slider field with its label and formatted value inside the control."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Scrub a numeric value by dragging anywhere in the field. The label and value sit
                inside the control, so a panel of adjustments reads as one column.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <CodeBlock code={usage} lang="svelte" copy="overlay" />
        <Typography.Text variant="supporting">
            The value runs from 0 to 100 in steps of 1 unless you set
            <Typography.InlineCode>min</Typography.InlineCode>,
            <Typography.InlineCode>max</Typography.InlineCode>, and
            <Typography.InlineCode>step</Typography.InlineCode>. Pass
            <Typography.InlineCode>format</Typography.InlineCode>
            to display units; screen readers hear the same text. Use
            <Typography.InlineCode>onValueChange</Typography.InlineCode>
            for live previews and
            <Typography.InlineCode>onValueCommit</Typography.InlineCode>
            for work that should run once, when the pointer is released or a key changes the value.
            Pass
            <Typography.InlineCode>name</Typography.InlineCode>
            to submit the value with a form.
        </Typography.Text>
    </section>

    <section id="interactions" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Interactions</Typography.H2>
        <ul class="flex list-disc flex-col gap-2 ps-5 text-sm text-foreground-muted">
            <li>
                The fill springs to the pressed point, then tracks the pointer closely while you
                drag. Coarse steps glide between stops instead of jumping.
            </li>
            <li>
                Dragging past either end stretches the field against the limit, and it settles back
                on release. Pressing an arrow key at the limit gives the same small push.
            </li>
            <li>
                The thumb grows on hover and press, and fades out while it passes behind the label
                or value so the text stays legible.
            </li>
            <li>
                On touch, the field waits for a horizontal drag or a tap, so vertical scrolling over
                it never changes the value.
            </li>
            <li>
                Arrow keys move by
                <Typography.InlineCode>step</Typography.InlineCode>, Shift with an arrow moves by
                ten steps, and Home and End jump to the limits.
            </li>
            <li>
                With
                <Typography.InlineCode>editable</Typography.InlineCode>, clicking the value, or
                pressing Enter while the slider is focused, turns it into a text field. Enter or
                blur commits the number, snapped to
                <Typography.InlineCode>step</Typography.InlineCode>
                and clamped to the limits, and Escape cancels. Units such as
                <Typography.InlineCode>px</Typography.InlineCode>
                are ignored; pass
                <Typography.InlineCode>parse</Typography.InlineCode>
                to read other formats. Pressing on the value edits instead of scrubbing.
            </li>
            <li>With reduced motion, the fill moves instantly and the field never stretches.</li>
        </ul>
    </section>

    <section id="composition" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Composition</Typography.H2>
        <Typography.Text variant="supporting">
            A slider without children renders
            <Typography.InlineCode>Range</Typography.InlineCode>,
            <Typography.InlineCode>Thumb</Typography.InlineCode>,
            <Typography.InlineCode>Label</Typography.InlineCode>
            (when
            <Typography.InlineCode>label</Typography.InlineCode>
            is set), and
            <Typography.InlineCode>Value</Typography.InlineCode>. Import the parts as a namespace
            and compose them to omit, reorder, or restyle one. The root is a
            <Typography.InlineCode>label</Typography.InlineCode>
            element, so
            <Typography.InlineCode>Label</Typography.InlineCode>
            text names the slider; without it, pass
            <Typography.InlineCode>label</Typography.InlineCode>
            to the root.
        </Typography.Text>
        <CodeBlock code={composition} lang="svelte" copy="overlay" />
        <Typography.Text variant="supporting">
            This slider drops the thumb, tints the range, puts the value first, and applies the
            exposure only when the drag ends.
        </Typography.Text>
        <ComponentPreview code={ComposedSrc}>
            <Composed />
        </ComponentPreview>
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <div id="stepped" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">With step and units</Typography.H3>
            <ComponentPreview code={SteppedSrc}>
                <Stepped />
            </ComponentPreview>
        </div>

        <div id="disabled" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Disabled</Typography.H3>
            <ComponentPreview code={DisabledSrc}>
                <Disabled />
            </ComponentPreview>
        </div>
    </section>
</div>
