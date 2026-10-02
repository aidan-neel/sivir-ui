<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import WithGroups from './examples/with-groups.svelte';
    import WithGroupsSrc from './examples/with-groups.svelte?raw';

    const TITLE = 'Command';
    const SLUG = 'command';

    const installCommand = `bunx --package @sivir-ui/svelte sivir add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta name="description" content="A modal command palette that filters items as you type." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Fuzzy-matches items as you type. Arrow keys move the highlight, Enter runs the item,
                and choosing an item closes the palette.
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
            Each Item needs a <Typography.InlineCode>name</Typography.InlineCode> (or
            <Typography.InlineCode>value</Typography.InlineCode>) for search. Run an action with
            <Typography.InlineCode>onclick</Typography.InlineCode>
            or navigate with
            <Typography.InlineCode>href</Typography.InlineCode>. Command registers no key binding;
            put a Shortcut inside Command.Trigger to open it from the keyboard. Command.Header and
            Command.Footer add optional rows above the search and below the results, pinned while
            the results scroll. Use them for a title or key hints.
        </Typography.Text>
        <CodeBlock
            code={`import * as Command from '@sivir-ui/svelte/components/command';\nimport Shortcut from '@sivir-ui/svelte/components/shortcut';\n\n<Command.Root>\n  <Command.Trigger>\n    Search or jump to…\n    <Shortcut shortcut="cmd+K" />\n  </Command.Trigger>\n  <Command.Content>\n    <Command.Header>Commands</Command.Header>\n    <Command.Search />\n    <Command.Results>\n      <Command.Group heading="Jump to">\n        <Command.Item name="Inbox" href="/inbox">Inbox</Command.Item>\n        <Command.Item name="Settings" href="/settings">Settings</Command.Item>\n      </Command.Group>\n      <Command.Group heading="Create">\n        <Command.Item name="New issue" onclick={createIssue}>New issue</Command.Item>\n      </Command.Group>\n    </Command.Results>\n    <Command.Footer>\n      <Shortcut shortcut="enter" /> open\n      <Shortcut shortcut="esc" /> close\n    </Command.Footer>\n  </Command.Content>\n</Command.Root>`}
            lang="svelte"
            copy="overlay"
        />
        <Typography.Text variant="supporting">
            With surface paneling on, the palette sits centered in an inset frame and group headings
            hide while you search. Turn paneling off in your theme and it becomes a wider palette
            anchored near the top, with a taller search row, roomier items, headings that stay
            visible while searching, and hairline rules setting off the header and footer.
        </Typography.Text>
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <!-- With groups -->
        <div id="with-groups" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With groups </Typography.H3>
            <ComponentPreview code={WithGroupsSrc}>
                <WithGroups />
            </ComponentPreview>
        </div>
    </section>
</div>
