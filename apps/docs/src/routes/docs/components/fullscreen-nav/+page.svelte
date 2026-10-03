<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import CustomTrigger from './examples/custom-trigger.svelte';
    import CustomTriggerSrc from './examples/custom-trigger.svelte?raw';
    import Grouped from './examples/grouped.svelte';
    import GroupedSrc from './examples/grouped.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const TITLE = 'Fullscreen Nav';
    const SLUG = 'fullscreen-nav';
    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A mobile navigation menu that covers the whole screen when opened."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Opens a full-screen layer of grouped links from a menu button. Choosing a link
                closes the menu.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Each <Typography.InlineCode>Group</Typography.InlineCode> requires a
            <Typography.InlineCode>heading</Typography.InlineCode>.
            <Typography.InlineCode>Trigger</Typography.InlineCode>
            and
            <Typography.InlineCode>Close</Typography.InlineCode>
            render a menu and an X icon unless you pass children.
        </Typography.Text>
        <CodeBlock
            code={`import * as FullscreenNav from '@sivir-ui/svelte/components/fullscreen-nav';

<FullscreenNav.Root>
  <FullscreenNav.Trigger />
  <FullscreenNav.Content label="Site navigation">
    <FullscreenNav.Close />
    <FullscreenNav.Group heading="Menu">
      <FullscreenNav.Link href="/">Home</FullscreenNav.Link>
      <FullscreenNav.Link href="/docs">Docs</FullscreenNav.Link>
    </FullscreenNav.Group>
  </FullscreenNav.Content>
</FullscreenNav.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="behavior" class="scroll-mt-20 flex flex-col gap-3">
        <Typography.H2 class="docs-section-heading"> Behavior </Typography.H2>
        <ul class="flex list-disc flex-col gap-2 pl-5 text-sm text-foreground-muted">
            <li>Focus is trapped inside the menu and restored to the trigger after it closes.</li>
            <li>Page scrolling is locked while the navigation is open.</li>
            <li>Press Escape, use Close, or activate a Link to dismiss the menu.</li>
            <li>
                Links are sized for touch, scale on press, and vibrate briefly on tap on devices
                that support it.
            </li>
            <li>
                Content is labeled "Navigation menu" by default. Pass
                <Typography.InlineCode>label</Typography.InlineCode>
                to name it more specifically.
            </li>
        </ul>
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="grouped-navigation" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Grouped navigation </Typography.H3>
            <Typography.Text variant="supporting">
                Use one <Typography.InlineCode>Group</Typography.InlineCode> per section. Its
                heading labels the links below it.
            </Typography.Text>
            <ComponentPreview code={GroupedSrc}>
                <Grouped />
            </ComponentPreview>
        </div>

        <div id="custom-trigger" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Custom trigger </Typography.H3>
            <Typography.Text variant="supporting">
                Children passed to <Typography.InlineCode>Trigger</Typography.InlineCode> replace
                the default icon, so you can add a visible label.
            </Typography.Text>
            <ComponentPreview code={CustomTriggerSrc}>
                <CustomTrigger />
            </ComponentPreview>
        </div>
    </section>
</div>
