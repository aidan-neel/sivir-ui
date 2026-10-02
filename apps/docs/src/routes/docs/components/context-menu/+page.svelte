<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import FileRow from './examples/file-row.svelte';
    import FileRowSrc from './examples/file-row.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Image from './examples/image.svelte';
    import ImageSrc from './examples/image.svelte?raw';
    import TaskCard from './examples/task-card.svelte';
    import TaskCardSrc from './examples/task-card.svelte?raw';

    const _TITLE = 'Context Menu';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add context-menu';
</script>

<svelte:head>
    <title>Sivir · Context Menu</title>
    <meta
        name="description"
        content="A menu that opens at the pointer when you right-click an element, with items, checkboxes, and submenus."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Context Menu </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Opens at the pointer on right-click or a tap on touch screens. From the keyboard,
                focus the trigger and press the Menu key or Shift+F10.
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
            Pass the action as <Typography.InlineCode>callback</Typography.InlineCode>;
            <Typography.InlineCode>ContextMenu.Item</Typography.InlineCode>
            ignores
            <Typography.InlineCode>onclick</Typography.InlineCode>.
            <Typography.InlineCode>CheckboxItem</Typography.InlineCode>
            requires a unique
            <Typography.InlineCode>value</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock
            code={`import * as ContextMenu from '@sivir-ui/svelte/components/context-menu';\n\nlet zoom = $state(1);\nlet showGrid = $state(true);\n\n<ContextMenu.Root>\n  <ContextMenu.Trigger>\n    <div>Canvas</div>\n  </ContextMenu.Trigger>\n  <ContextMenu.Content>\n    <ContextMenu.Item callback={() => (zoom = 1)}>Reset zoom</ContextMenu.Item>\n    <ContextMenu.CheckboxItem value="grid" bind:checked={showGrid}>Show grid</ContextMenu.CheckboxItem>\n  </ContextMenu.Content>\n</ContextMenu.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="file-row" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> File actions </Typography.H3>
            <ComponentPreview code={FileRowSrc}>
                <FileRow />
            </ComponentPreview>
        </div>

        <div id="image" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Image actions </Typography.H3>
            <ComponentPreview code={ImageSrc}>
                <Image />
            </ComponentPreview>
        </div>

        <div id="task-card" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Task actions </Typography.H3>
            <ComponentPreview code={TaskCardSrc}>
                <TaskCard />
            </ComponentPreview>
        </div>
    </section>
</div>
