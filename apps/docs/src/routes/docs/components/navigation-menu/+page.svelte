<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PropGroup,
        PropRow,
        PropSegmented,
        PropSwitch
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import ActiveLink from './examples/active-link.svelte';
    import ActiveLinkSrc from './examples/active-link.svelte?raw';
    import Controlled from './examples/controlled.svelte';
    import ControlledSrc from './examples/controlled.svelte?raw';
    import Responsive from './examples/responsive.svelte';
    import ResponsiveSrc from './examples/responsive.svelte?raw';
    import Simple from './examples/simple.svelte';
    import SimpleSrc from './examples/simple.svelte?raw';
    import {
        changedNavigationMenuProps,
        type NavigationMenuCloseDelay,
        type NavigationMenuOpenDelay,
        type NavigationMenuSettings,
        navigationMenuCode,
        navigationMenuDefaults
    } from './playground/playground';
    import Preview from './playground/preview.svelte';

    type Option<T extends string> = {
        value: T;
        label: string;
    };

    const TITLE = 'Navigation Menu';

    const installCommand = 'bunx @sivir-ui/svelte add navigation-menu';

    const usageSnippet = `import * as NavigationMenu from '@sivir-ui/svelte/components/navigation-menu';

<NavigationMenu.Root aria-label="Main">
  <NavigationMenu.List>
    <NavigationMenu.Item value="products">
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content class="grid w-120 grid-cols-2">
        <NavigationMenu.Link href="/analytics">
          <NavigationMenu.LinkTitle>Analytics</NavigationMenu.LinkTitle>
          <NavigationMenu.LinkDescription>
            Dashboards and funnels for every release.
          </NavigationMenu.LinkDescription>
        </NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
  <NavigationMenu.Viewport />
</NavigationMenu.Root>`;

    const openDelayOptions: Option<NavigationMenuOpenDelay>[] = [
        {
            value: '0',
            label: '0 ms'
        },
        {
            value: '150',
            label: '150 ms'
        },
        {
            value: '400',
            label: '400 ms'
        }
    ];
    const closeDelayOptions: Option<NavigationMenuCloseDelay>[] = [
        {
            value: '0',
            label: '0 ms'
        },
        {
            value: '200',
            label: '200 ms'
        },
        {
            value: '500',
            label: '500 ms'
        }
    ];

    let settings = $state<NavigationMenuSettings>({
        ...navigationMenuDefaults
    });

    const heroCode = $derived(navigationMenuCode(settings));
    const changed = $derived(changedNavigationMenuProps(settings));
</script>

{#snippet navigationMenuProps()}
    <PropGroup title="Timing">
        <PropRow label="Open delay">
            <PropSegmented
                label="Open delay"
                size="sm"
                options={openDelayOptions}
                bind:value={settings.openDelay}
            />
        </PropRow>
        <PropRow label="Close delay">
            <PropSegmented
                label="Close delay"
                size="sm"
                options={closeDelayOptions}
                bind:value={settings.closeDelay}
            />
        </PropRow>
    </PropGroup>
    <PropGroup title="Links">
        <PropSwitch label="Active Pricing link" bind:checked={settings.activePricing} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · Navigation Menu</title>
    <meta
        name="description"
        content="A site header menu that opens link panels on hover or click, with one shared viewport that morphs between panels."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A site header menu. Triggers open panels of links, and one viewport resizes and
                slides between them as the pointer moves across the row.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={navigationMenuProps} {changed}>
            <Preview {settings} />
        </ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Each
            <Typography.InlineCode>NavigationMenu.Item</Typography.InlineCode>
            pairs a
            <Typography.InlineCode>NavigationMenu.Trigger</Typography.InlineCode>
            with a
            <Typography.InlineCode>NavigationMenu.Content</Typography.InlineCode>, or holds a single
            top-level
            <Typography.InlineCode>NavigationMenu.Link</Typography.InlineCode>. Content does not
            render where you write it. The open item's content renders inside
            <Typography.InlineCode>NavigationMenu.Viewport</Typography.InlineCode>, so place one
            Viewport after the list. The Viewport renders in a layer above the page, under the menu,
            so the surrounding layout needs no room for it and no parent clips it. Size each panel
            with a width class on its Content, and the Viewport animates between those sizes.
        </Typography.Text>
        <Typography.Text variant="supporting">
            Hovering a trigger opens its panel after
            <Typography.InlineCode>openDelay</Typography.InlineCode>
            (150ms). Once a panel is open, moving to another trigger switches at once. Leaving the
            menu closes it after
            <Typography.InlineCode>closeDelay</Typography.InlineCode>
            (200ms). Clicking a trigger pins its panel open until you click it again, click outside,
            or press Escape.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
    </section>

    <!-- ─── Example Descriptions ──────────────────────────────────── -->
    {#snippet simpleDescription()}
        <Typography.Text variant="supporting">
            A link with plain text renders as a single row. Hover and keyboard focus share one
            highlight that travels between links, the same one menus use. Arrow keys move between
            links in a panel, and between items in the top row.
        </Typography.Text>
    {/snippet}

    {#snippet activeLinkDescription()}
        <Typography.Text variant="supporting">
            Pass <Typography.InlineCode>active</Typography.InlineCode> to mark the current page. The
            link gets
            <Typography.InlineCode>aria-current="page"</Typography.InlineCode>
            and full-strength text.
        </Typography.Text>
    {/snippet}

    {#snippet controlledDescription()}
        <Typography.Text variant="supporting">
            Bind <Typography.InlineCode>value</Typography.InlineCode> to read or set the open item.
            It holds the open item's
            <Typography.InlineCode>value</Typography.InlineCode>, or an empty string when the menu
            is closed.
        </Typography.Text>
    {/snippet}

    {#snippet responsiveDescription()}
        <Typography.Text variant="supporting">
            Hover panels do not suit narrow touch screens. Hide the menu below
            <Typography.InlineCode>md</Typography.InlineCode>
            and offer the same links in a
            <Typography.InlineCode>FullscreenNav</Typography.InlineCode>
            instead.
        </Typography.Text>
    {/snippet}

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="simple" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Simple links </Typography.H3>
            <ComponentPreview code={SimpleSrc}>
                <Simple />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render simpleDescription()}
            </div>
        </div>

        <div id="active-link" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Active link </Typography.H3>
            <ComponentPreview code={ActiveLinkSrc}>
                <ActiveLink />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render activeLinkDescription()}
            </div>
        </div>

        <div id="controlled" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Controlled </Typography.H3>
            <ComponentPreview code={ControlledSrc}>
                <Controlled />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render controlledDescription()}
            </div>
        </div>

        <div id="responsive" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Small screens </Typography.H3>
            <ComponentPreview code={ResponsiveSrc}>
                <Responsive />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render responsiveDescription()}
            </div>
        </div>
    </section>
</div>
