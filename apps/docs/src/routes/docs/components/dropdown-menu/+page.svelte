<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import BasicMenu from './examples/basic-menu.svelte';
    import BasicMenuSrc from './examples/basic-menu.svelte?raw';
    import Configuration from './examples/configuration.svelte';
    import ConfigurationSrc from './examples/configuration.svelte?raw';
    import DynamicWidth from './examples/dynamic-width.svelte';
    import DynamicWidthSrc from './examples/dynamic-width.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import RowActions from './examples/row-actions.svelte';
    import RowActionsSrc from './examples/row-actions.svelte?raw';
    import ShareMenu from './examples/share-menu.svelte';
    import ShareMenuSrc from './examples/share-menu.svelte?raw';
    import SortMenu from './examples/sort-menu.svelte';
    import SortMenuSrc from './examples/sort-menu.svelte?raw';
    import UserMenu from './examples/user-menu.svelte';
    import UserMenuSrc from './examples/user-menu.svelte?raw';

    const _TITLE = 'Dropdown Menu';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add dropdown-menu';
</script>

<svelte:head>
    <title>Sivir · Dropdown Menu</title>
    <meta
        name="description"
        content="A menu of actions, checkboxes, and radio options that opens from a button."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Dropdown Menu </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Opens below the trigger, aligned to its start edge, and closes when you pick an
                item. Escape closes the deepest open submenu first.
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
            Run an action with <Typography.InlineCode>callback</Typography.InlineCode> or
            <Typography.InlineCode>onclick</Typography.InlineCode>
            on
            <Typography.InlineCode>DropdownMenu.Item</Typography.InlineCode>. Bind
            <Typography.InlineCode>checked</Typography.InlineCode>
            on
            <Typography.InlineCode>CheckboxItem</Typography.InlineCode>
            and
            <Typography.InlineCode>value</Typography.InlineCode>
            on
            <Typography.InlineCode>RadioGroup</Typography.InlineCode>
            to read the selection.
        </Typography.Text>
        <CodeBlock
            code={`import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';\nimport Shortcut from '@sivir-ui/svelte/components/shortcut';\n\nlet showArchived = $state(false);\n\n<DropdownMenu.Root>\n  <DropdownMenu.Trigger>View</DropdownMenu.Trigger>\n  <DropdownMenu.Content>\n    <DropdownMenu.Item callback={() => navigator.clipboard.writeText(location.href)}>\n      Copy link\n      <Shortcut shortcut="shift+cmd+C" />\n    </DropdownMenu.Item>\n    <DropdownMenu.CheckboxItem bind:checked={showArchived}>\n      Show archived\n    </DropdownMenu.CheckboxItem>\n  </DropdownMenu.Content>\n</DropdownMenu.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <!-- Basic menu -->
        <div id="basic-menu" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Basic menu </Typography.H3>
            <ComponentPreview code={BasicMenuSrc}>
                <BasicMenu />
            </ComponentPreview>
        </div>

        <!-- Grouped (user) menu -->
        <div id="user-menu" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Grouped items </Typography.H3>
            <ComponentPreview code={UserMenuSrc}>
                <UserMenu />
            </ComponentPreview>
        </div>

        <!-- Row actions -->
        <div id="row-actions" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Row actions </Typography.H3>
            <ComponentPreview code={RowActionsSrc}>
                <RowActions />
            </ComponentPreview>
        </div>

        <!-- Share menu -->
        <div id="share-menu" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Share menu </Typography.H3>
            <ComponentPreview code={ShareMenuSrc}>
                <ShareMenu />
            </ComponentPreview>
        </div>

        <!-- Sort menu -->
        <div id="sort-menu" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Sort menu </Typography.H3>
            <ComponentPreview code={SortMenuSrc}>
                <SortMenu />
            </ComponentPreview>
        </div>

        <div id="configuration-menu" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Configuration submenu </Typography.H3>
            <Typography.Text variant="supporting">
                Each <Typography.InlineCode>SubTrigger</Typography.InlineCode> opens its
                <Typography.InlineCode>SubContent</Typography.InlineCode>
                on hover.
            </Typography.Text>
            <ComponentPreview code={ConfigurationSrc}>
                <Configuration />
            </ComponentPreview>
        </div>

        <div id="dynamic-width" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Dynamic width </Typography.H3>
            <Typography.Text variant="supporting">
                Set <Typography.InlineCode>dynamic</Typography.InlineCode> on
                <Typography.InlineCode>Content</Typography.InlineCode>
                or
                <Typography.InlineCode>SubContent</Typography.InlineCode>
                to size the panel to its widest item plus 16px.
            </Typography.Text>
            <ComponentPreview code={DynamicWidthSrc}>
                <DynamicWidth />
            </ComponentPreview>
        </div>
    </section>
</div>
