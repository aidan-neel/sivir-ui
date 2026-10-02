<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Left from './examples/left.svelte';
    import LeftSrc from './examples/left.svelte?raw';
    import Right from './examples/right.svelte';
    import RightSrc from './examples/right.svelte?raw';

    const TITLE = 'Sheet';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add sheet';
</script>

<svelte:head>
    <title>Sivir · Sheet</title>
    <meta
        name="description"
        content="A drawer anchored to the left or right edge of the screen, for menus, filters, and forms."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A drawer that slides in from the left or right edge. It traps focus and closes on
                Escape, an outside click, or the close button in its header.
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
            Set <Typography.InlineCode>side</Typography.InlineCode> on
            <Typography.InlineCode>Sheet.Content</Typography.InlineCode>
            to
            <Typography.InlineCode>left</Typography.InlineCode>
            or
            <Typography.InlineCode>right</Typography.InlineCode>
            (the default). A custom
            <Typography.InlineCode>onclick</Typography.InlineCode>
            on
            <Typography.InlineCode>Sheet.Close</Typography.InlineCode>
            replaces its close behavior, so set
            <Typography.InlineCode>open</Typography.InlineCode>
            to false yourself.
        </Typography.Text>
        <CodeBlock
            code={`import { Button } from '@sivir-ui/svelte/components/button';\nimport * as Sheet from '@sivir-ui/svelte/components/sheet';\nimport Shortcut from '@sivir-ui/svelte/components/shortcut';\n\nlet open = $state(false);\n\n<Sheet.Root bind:open>\n  <Sheet.Trigger>Edit profile</Sheet.Trigger>\n  <Sheet.Content side="right">\n    <Sheet.Header>\n      <Sheet.Title>Edit profile</Sheet.Title>\n      <Sheet.Description>Your name and photo are visible to your team.</Sheet.Description>\n    </Sheet.Header>\n    <!-- form fields -->\n    <Sheet.Footer>\n      <Sheet.Close>Cancel <Shortcut shortcut="esc" /></Sheet.Close>\n      <Button onclick={() => (open = false)}>Save <Shortcut shortcut="enter" /></Button>\n    </Sheet.Footer>\n  </Sheet.Content>\n</Sheet.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <!-- Left side -->
        <div id="left" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Left side</Typography.H3>
            <ComponentPreview code={LeftSrc}>
                <Left />
            </ComponentPreview>
        </div>

        <!-- Right side -->
        <div id="right" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Right side</Typography.H3>
            <ComponentPreview code={RightSrc}>
                <Right />
            </ComponentPreview>
        </div>
    </section>
</div>
