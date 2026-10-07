<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Disabled from './examples/disabled.svelte';
    import DisabledSrc from './examples/disabled.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import WithRequired from './examples/with-required.svelte';
    import WithRequiredSrc from './examples/with-required.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add label';
</script>

<svelte:head>
    <title>Sivir · Label</title>
    <meta
        name="description"
        content="A native label element with the label type styles, for naming a form control."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Label </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Renders a native label and passes through its attributes. When it follows a disabled
                control that has the <Typography.InlineCode>peer</Typography.InlineCode> class, it
                dims to match.
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
            Set <Typography.InlineCode>for</Typography.InlineCode> to the control's
            <Typography.InlineCode>id</Typography.InlineCode>. Input and Textarea render their own
            label when you pass <Typography.InlineCode>label</Typography.InlineCode>, so use Label
            for custom layouts.
        </Typography.Text>
        <CodeBlock
            code={`import { Label } from '@sivir-ui/svelte/components/label';\nimport { Input } from '@sivir-ui/svelte/components/input';\n\n<Label for="email">Email</Label>\n<Input id="email" type="email" />`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="required" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With required indicator </Typography.H3>
            <ComponentPreview code={WithRequiredSrc}>
                <WithRequired />
            </ComponentPreview>
        </div>

        <div id="disabled" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Disabled field </Typography.H3>
            <ComponentPreview code={DisabledSrc}>
                <Disabled />
            </ComponentPreview>
        </div>
    </section>
</div>
