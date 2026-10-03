<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Basic from './examples/basic.svelte';
    import BasicSrc from './examples/basic.svelte?raw';
    import Context from './examples/context.svelte';
    import ContextSrc from './examples/context.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Modifiers from './examples/modifiers.svelte';
    import ModifiersSrc from './examples/modifiers.svelte?raw';

    const TITLE = 'Shortcut';

    const installCommand = 'bunx @sivir-ui/svelte add shortcut';
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="Shows a keyboard shortcut as a key chip and runs it when the keys are pressed."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Renders key glyphs such as ⌘K. While it is mounted, pressing those keys clicks the
                button or link it sits in, or calls
                <Typography.InlineCode>ontrigger</Typography.InlineCode>.
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
            Join keys with <Typography.InlineCode>+</Typography.InlineCode>, as in
            <Typography.InlineCode>ctrl+shift+P</Typography.InlineCode>.
            <Typography.InlineCode>cmd</Typography.InlineCode>
            matches the Meta key only; use
            <Typography.InlineCode>ctrl</Typography.InlineCode>
            for Control. A Shortcut outside a button or link without
            <Typography.InlineCode>ontrigger</Typography.InlineCode>
            only displays. Keys typed into a field are ignored, except Enter and Escape in an input.
            A Shortcut inside an overlay that another overlay covers does not fire. The chip is
            hidden below the
            <Typography.InlineCode>sm</Typography.InlineCode>
            breakpoint, but the binding stays active.
        </Typography.Text>
        <CodeBlock
            code={`import { Button } from '@sivir-ui/svelte/components/button';\nimport Shortcut from '@sivir-ui/svelte/components/shortcut';\n\n<Button onclick={save}>\n  Save\n  <Shortcut shortcut="cmd+S" />\n</Button>\n\n<Shortcut shortcut="ctrl+K" ontrigger={openSearch} />`}
            lang="svelte"
            copy="overlay"
        />
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

        <!-- With modifiers -->
        <div id="modifiers" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">With modifiers</Typography.H3>
            <ComponentPreview code={ModifiersSrc}>
                <Modifiers />
            </ComponentPreview>
        </div>

        <!-- In context -->
        <div id="context" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">In context</Typography.H3>
            <ComponentPreview code={ContextSrc}>
                <Context />
            </ComponentPreview>
        </div>
    </section>
</div>
