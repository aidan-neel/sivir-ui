<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import BadgesActions from './examples/badges-actions.svelte';
    import BadgesActionsSrc from './examples/badges-actions.svelte?raw';
    import CollapsibleGroups from './examples/collapsible-groups.svelte';
    import CollapsibleGroupsSrc from './examples/collapsible-groups.svelte?raw';
    import Default from './examples/default.svelte';
    import DefaultSrc from './examples/default.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import IconRail from './examples/icon-rail.svelte';
    import IconRailSrc from './examples/icon-rail.svelte?raw';
    import Nested from './examples/nested.svelte';
    import NestedSrc from './examples/nested.svelte?raw';
    import RightSide from './examples/right-side.svelte';
    import RightSideSrc from './examples/right-side.svelte?raw';

    const TITLE = 'Sidebar';

    const installCommand = 'bunx @sivir-ui/svelte add sidebar';

    const usageSnippet = `import * as Sidebar from '@sivir-ui/svelte/components/sidebar';

let open = $state(true);

<Sidebar.Root bind:open variant="inset" collapsible="icon" class="h-svh">
  <Sidebar.Panel>
    <Sidebar.Header><!-- workspace switcher --></Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group collapsible>
        <Sidebar.GroupLabel>Private</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.Item>
              <Sidebar.ItemButton href="/inbox" active tooltip="Inbox">
                <InboxIcon />
                <Sidebar.ItemLabel>Inbox</Sidebar.ItemLabel>
              </Sidebar.ItemButton>
              <Sidebar.ItemBadge>3</Sidebar.ItemBadge>
            </Sidebar.Item>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer><!-- settings --></Sidebar.Footer>
  </Sidebar.Panel>
  <Sidebar.Inset>
    <header><Sidebar.Trigger /></header>
    <!-- page content -->
  </Sidebar.Inset>
</Sidebar.Root>`;
</script>

<svelte:head>
    <title>Sivir · Sidebar</title>
    <meta
        name="description"
        content="A collapsible app-shell sidebar with an inset layout, an icon rail, collapsible groups, badges, and a mobile drawer."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                An app-shell navigation column. It collapses out of view or down to an icon rail on
                desktop, and becomes a drawer on small screens.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc} fill>
            <Hero />
        </ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            <Typography.InlineCode>Sidebar.Root</Typography.InlineCode>
            lays out
            <Typography.InlineCode>Sidebar.Panel</Typography.InlineCode>
            and
            <Typography.InlineCode>Sidebar.Inset</Typography.InlineCode>
            in a row. It does not set its own height, so give it one, such as
            <Typography.InlineCode>h-svh</Typography.InlineCode>
            for a full-page shell. Bind
            <Typography.InlineCode>open</Typography.InlineCode>
            to keep or persist the desktop state, and
            <Typography.InlineCode>openMobile</Typography.InlineCode>
            for the drawer.
        </Typography.Text>
        <Typography.Text variant="supporting">
            Set <Typography.InlineCode>variant="inset"</Typography.InlineCode> to raise the main
            area onto its own rounded surface. Set
            <Typography.InlineCode>collapsible</Typography.InlineCode>
            to
            <Typography.InlineCode>offcanvas</Typography.InlineCode>
            (the default) to slide the panel out of view,
            <Typography.InlineCode>icon</Typography.InlineCode>
            to shrink it to an icon rail, or
            <Typography.InlineCode>none</Typography.InlineCode>
            to keep it open. Below 768px the panel always becomes a drawer that
            <Typography.InlineCode>Sidebar.Trigger</Typography.InlineCode>
            opens, and following a link inside it closes it.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <div id="default" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Default</Typography.H3>
            <Typography.Text variant="supporting">
                The default variant separates the panel from the page with a border. The trigger
                slides the panel out of view. Hover and keyboard focus share one highlight that
                travels between rows across groups, the same one menus use.
            </Typography.Text>
            <ComponentPreview code={DefaultSrc} fill>
                <Default />
            </ComponentPreview>
        </div>

        <div id="icon-rail" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Icon rail</Typography.H3>
            <Typography.Text variant="supporting">
                With <Typography.InlineCode>collapsible="icon"</Typography.InlineCode>, the
                collapsed panel keeps its icons. Labels stay available to screen readers, and the
                <Typography.InlineCode>tooltip</Typography.InlineCode>
                on each
                <Typography.InlineCode>Sidebar.ItemButton</Typography.InlineCode>
                shows them on hover. Group labels, badges, actions, and sub-menus hide, and
                collapsible groups stay open.
            </Typography.Text>
            <ComponentPreview code={IconRailSrc} fill>
                <IconRail />
            </ComponentPreview>
        </div>

        <div id="collapsible-groups" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Collapsible groups</Typography.H3>
            <Typography.Text variant="supporting">
                Add <Typography.InlineCode>collapsible</Typography.InlineCode> to
                <Typography.InlineCode>Sidebar.Group</Typography.InlineCode>
                to turn its label into a toggle. Bind
                <Typography.InlineCode>open</Typography.InlineCode>
                to control it.
            </Typography.Text>
            <ComponentPreview code={CollapsibleGroupsSrc} fill>
                <CollapsibleGroups />
            </ComponentPreview>
        </div>

        <div id="badges-actions" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Badges and actions</Typography.H3>
            <Typography.Text variant="supporting">
                <Typography.InlineCode>Sidebar.ItemBadge</Typography.InlineCode>
                shows a trailing count.
                <Typography.InlineCode>Sidebar.ItemAction</Typography.InlineCode>
                appears on hover or focus and takes the badge's place. It needs an
                <Typography.InlineCode>aria-label</Typography.InlineCode>. On touch screens it is
                always visible.
            </Typography.Text>
            <ComponentPreview code={BadgesActionsSrc} fill>
                <BadgesActions />
            </ComponentPreview>
        </div>

        <div id="nested" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Nested items</Typography.H3>
            <Typography.Text variant="supporting">
                Place a <Typography.InlineCode>Sidebar.Menu</Typography.InlineCode> inside a
                <Typography.InlineCode>Sidebar.Item</Typography.InlineCode>
                to indent it under that item. Pass
                <Typography.InlineCode>href</Typography.InlineCode>
                to render a link, and
                <Typography.InlineCode>active</Typography.InlineCode>
                to mark the current page.
            </Typography.Text>
            <ComponentPreview code={NestedSrc} fill>
                <Nested />
            </ComponentPreview>
        </div>

        <div id="right-side" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Right side</Typography.H3>
            <Typography.Text variant="supporting">
                Set <Typography.InlineCode>side="right"</Typography.InlineCode> on
                <Typography.InlineCode>Sidebar.Panel</Typography.InlineCode>. The panel moves to the
                end of the row in either source order, and the drawer slides in from the right.
            </Typography.Text>
            <ComponentPreview code={RightSideSrc} fill>
                <RightSide />
            </ComponentPreview>
        </div>
    </section>
</div>
