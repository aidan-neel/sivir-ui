<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Basic from './examples/basic.svelte';
    import BasicSrc from './examples/basic.svelte?raw';
    import Description from './examples/description.svelte';
    import DescriptionSrc from './examples/description.svelte?raw';
    import Disabled from './examples/disabled.svelte';
    import DisabledSrc from './examples/disabled.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const TITLE = 'Switch';

    const installCommand = 'bunx @sivir-ui/svelte add switch';
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="An on/off switch with a bindable checked state and an optional label and description."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A button with the switch role, for settings that apply as soon as they change. Use a
                Checkbox when the choice is saved with a form.
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
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Bind <Typography.InlineCode>checked</Typography.InlineCode> to read and set the state.
            The older <Typography.InlineCode>switched</Typography.InlineCode> prop still works.
        </Typography.Text>
        <CodeBlock
            code={`import { Switch } from '@sivir-ui/svelte/components/switch';\n\nlet enabled = $state(false);\n\n<Switch bind:checked={enabled} label="Email notifications" />`}
            lang="svelte"
            copy="overlay"
        />
        <Typography.Text variant="supporting">
            Click, tap, or press Space or Enter to toggle, or drag the thumb across the track and
            release it on either side. The thumb follows a spring, stretches while pressed or
            moving, and the track fills with the primary color as the thumb travels. Clicking the
            label toggles the switch too. With reduced motion, the thumb moves without animating.
        </Typography.Text>
        <Typography.Text variant="supporting">
            Theme the motion with
            <Typography.InlineCode>--motion-duration-switch</Typography.InlineCode>
            (default <Typography.InlineCode>280ms</Typography.InlineCode>, lower is faster,
            <Typography.InlineCode>0ms</Typography.InlineCode>
            snaps) and
            <Typography.InlineCode>--motion-switch-stretch</Typography.InlineCode>
            (default
            <Typography.InlineCode>1</Typography.InlineCode>,
            <Typography.InlineCode>0</Typography.InlineCode>
            turns the stretch off).
        </Typography.Text>
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <!-- Basic -->
        <div id="basic" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Basic</Typography.H3>
            <ComponentPreview code={BasicSrc}>
                <Basic />
            </ComponentPreview>
        </div>

        <!-- With description -->
        <div id="description" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">With description</Typography.H3>
            <ComponentPreview code={DescriptionSrc}>
                <Description />
            </ComponentPreview>
        </div>

        <!-- Disabled -->
        <div id="disabled" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Disabled</Typography.H3>
            <ComponentPreview code={DisabledSrc}>
                <Disabled />
            </ComponentPreview>
        </div>
    </section>
</div>
