<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import RoleVariants from './examples/role-variants.svelte';
    import RoleVariantsSrc from './examples/role-variants.svelte?raw';
    import States from './examples/states.svelte';
    import StatesSrc from './examples/states.svelte?raw';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add message';
    const usageSnippet = `import * as Message from '@sivir-ui/svelte/components/message';

<Message.Root from="assistant" status="idle">
  <Message.Content>
    I found three sources that agree on the release date.
  </Message.Content>
  <Message.Actions aria-label="Assistant response actions">
    <!-- Add labeled actions such as copy or rate -->
  </Message.Actions>
</Message.Root>`;
</script>

<svelte:head>
    <title>Sivir · Message</title>
    <meta
        name="description"
        content="One chat message, aligned and styled by who sent it, with an optional row of actions."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Message </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                User messages sit right-aligned in a tinted bubble, assistant text runs full width,
                and system notes are centered and muted. Name, timestamp, and avatar are optional.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            <Typography.InlineCode>from</Typography.InlineCode>
            defaults to
            <Typography.InlineCode>"assistant"</Typography.InlineCode>.
            <Typography.InlineCode>status="streaming"</Typography.InlineCode>
            marks the message busy, and
            <Typography.InlineCode>status="error"</Typography.InlineCode>
            adds a Failed label above the content. On devices with a mouse,
            <Typography.InlineCode>Actions</Typography.InlineCode>
            stays hidden until the message is hovered or focused. Give icon-only actions an
            <Typography.InlineCode>aria-label</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="role-variants" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Role variants </Typography.H3>
            <ComponentPreview code={RoleVariantsSrc}><RoleVariants /></ComponentPreview>
        </div>

        <div id="message-states" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">
                Streaming and error states
            </Typography.H3>
            <ComponentPreview code={StatesSrc}><States /></ComponentPreview>
        </div>
    </section>
</div>
