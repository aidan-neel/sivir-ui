<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import DynamicWidth from './examples/dynamic-width.svelte';
    import DynamicWidthSrc from './examples/dynamic-width.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Scrollable from './examples/scrollable.svelte';
    import ScrollableSrc from './examples/scrollable.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add select';
</script>

<svelte:head>
    <title>Sivir · Select</title>
    <meta
        name="description"
        content="A dropdown that picks one value from a fixed list of options, with a bindable value."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Select </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                The menu opens with focus on the selected option, and arrow keys, Home, and End move
                between options. Use a Combobox when people need to search the list.
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
            Bind <Typography.InlineCode>value</Typography.InlineCode> on
            <Typography.InlineCode>Select.Root</Typography.InlineCode>; it is an empty string until
            an option is picked. An empty trigger shows the selected option's text. Add
            <Typography.InlineCode>Select.Value</Typography.InlineCode>
            inside it to set the placeholder.
        </Typography.Text>
        <CodeBlock
            code={`import * as Select from '@sivir-ui/svelte/components/select';\n\nlet role = $state('');\n\n<Select.Root bind:value={role}>\n  <Select.Trigger>\n    <Select.Value placeholder="Choose a role" />\n  </Select.Trigger>\n  <Select.Content>\n    <Select.Item value="designer">Designer</Select.Item>\n    <Select.Item value="engineer">Engineer</Select.Item>\n  </Select.Content>\n</Select.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <div id="basic" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Basic</Typography.H3>
            <ComponentPreview code={HeroSrc}>
                <Hero />
            </ComponentPreview>
        </div>

        <div id="scrollable" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Scrollable</Typography.H3>
            <Typography.Text variant="supporting">
                Add a <Typography.InlineCode>max-h-*</Typography.InlineCode> class to
                <Typography.InlineCode>Select.Content</Typography.InlineCode>
                to cap the menu height. Longer lists scroll inside it.
            </Typography.Text>
            <ComponentPreview code={ScrollableSrc}>
                <Scrollable />
            </ComponentPreview>
        </div>

        <div id="dynamic-width" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Dynamic width</Typography.H3>
            <Typography.Text variant="supporting">
                Set <Typography.InlineCode>dynamic</Typography.InlineCode> on
                <Typography.InlineCode>Select.Content</Typography.InlineCode>
                to size the menu to its longest option, even when the trigger is narrower.
            </Typography.Text>
            <ComponentPreview code={DynamicWidthSrc}>
                <DynamicWidth />
            </ComponentPreview>
        </div>
    </section>
</div>
