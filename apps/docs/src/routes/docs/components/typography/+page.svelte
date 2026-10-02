<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import HeadingLevels from './examples/heading-levels.svelte';
    import HeadingLevelsSrc from './examples/heading-levels.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Metadata from './examples/metadata.svelte';
    import MetadataSrc from './examples/metadata.svelte?raw';
    import TextRoles from './examples/text-roles.svelte';
    import TextRolesSrc from './examples/text-roles.svelte?raw';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add typography';
    const usage = `import * as Typography from '@sivir-ui/svelte/components/typography';

<Typography.H2>Account settings</Typography.H2>
<Typography.Text variant="supporting">Manage your profile and preferences.</Typography.Text>
<Typography.Text variant="body">
  Changes are saved to <Typography.InlineCode>profile.json</Typography.InlineCode>.
</Typography.Text>
<Typography.Metadata>Updated 4 minutes ago</Typography.Metadata>`;

    const roles = [
        {
            name: 'H1-H6',
            element: 'h1-h6',
            tokens: '--font-header / document heading scale / --font-weight-header'
        },
        {
            name: 'Text · lead',
            element: 'p',
            tokens: '1rem / --font-weight-description / foreground-muted'
        },
        {
            name: 'Text · body',
            element: 'p',
            tokens: '1rem / --font-weight-body / foreground'
        },
        {
            name: 'Text · supporting',
            element: 'p',
            tokens: '--font-size-body / --font-weight-body / foreground-muted'
        },
        {
            name: 'InlineCode',
            element: 'code',
            tokens: '--font-mono / --radius-sm / secondary'
        },
        {
            name: 'Title',
            element: 'h1-h6',
            tokens: '--font-header / --font-size-header / --font-weight-header'
        },
        {
            name: 'Description',
            element: 'p',
            tokens: '--font-size-body / --font-weight-description / --tracking-body'
        },
        {
            name: 'Metadata',
            element: 'span',
            tokens: '--text-xs / --font-weight-body / --tracking-body'
        }
    ];
</script>

<svelte:head>
    <title>Sivir · Typography</title>
    <meta
        name="description"
        content="Heading, paragraph, inline code, and metadata components styled from the theme's type tokens."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Typography </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                H1 through H6 render their matching heading element at the document scale. Title
                takes a level prop, so a component heading can use any h1 to h6 tag at one fixed
                size.
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
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting" class="m-0 max-w-2xl">
            Text defaults to the supporting variant; set
            <Typography.InlineCode>variant</Typography.InlineCode>
            to lead or body. Classes you pass through
            <Typography.InlineCode>class</Typography.InlineCode>
            override the defaults.
        </Typography.Text>
        <CodeBlock code={usage} lang="svelte" copy="overlay" />
    </section>

    <section id="roles" class="scroll-mt-20 flex flex-col gap-5">
        <div>
            <Typography.H2 class="docs-section-heading">Role reference</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2 max-w-2xl">
                Each part sets type and color only. None of them add margins, so spacing comes from
                the parent layout.
            </Typography.Text>
        </div>

        <div class="divide-y divide-border border-y border-border">
            {#each roles as role (role.name)}
                <div
                    class="grid gap-2 py-4 sm:grid-cols-[7rem_5rem_1fr] sm:items-baseline sm:gap-6"
                >
                    <span class="text-sm font-[var(--font-weight-label,500)] text-foreground">
                        {role.name}
                    </span>
                    <code class="font-mono text-xs text-foreground-muted">{role.element}</code>
                    <code
                        class="break-words font-mono text-xs leading-relaxed text-foreground-muted"
                    >
                        {role.tokens}
                    </code>
                </div>
            {/each}
        </div>
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <div id="heading-levels" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Heading levels</Typography.H3>
            <Typography.Text variant="supporting" class="m-0 max-w-2xl">
                Pick the level from the document outline. For a heading inside a component, use
                <Typography.InlineCode>Typography.Title</Typography.InlineCode>
                with a
                <Typography.InlineCode>level</Typography.InlineCode>
                instead.
            </Typography.Text>
            <ComponentPreview code={HeadingLevelsSrc}>
                <HeadingLevels />
            </ComponentPreview>
        </div>

        <div id="text-roles" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Text roles</Typography.H3>
            <Typography.Text variant="supporting" class="m-0 max-w-2xl">
                Text renders a <Typography.InlineCode>p</Typography.InlineCode>. Pick the variant
                from the paragraph's job: lead opens a page or section, body is long-form prose, and
                supporting is secondary context.
            </Typography.Text>
            <ComponentPreview code={TextRolesSrc}>
                <TextRoles />
            </ComponentPreview>
        </div>

        <div id="numeric-metadata" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Numeric metadata</Typography.H3>
            <Typography.Text variant="supporting" class="m-0 max-w-2xl">
                Add <Typography.InlineCode>tabular-nums</Typography.InlineCode> when readers compare
                values in a column.
            </Typography.Text>
            <ComponentPreview code={MetadataSrc}>
                <Metadata />
            </ComponentPreview>
        </div>
    </section>
</div>
