<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewMorph,
        PropGroup,
        PropRow,
        PropSegmented,
        PropSwitch
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import {
        changedMessageProps,
        type MessagePlaygroundStatus,
        type MessageSettings,
        messageCode,
        messageDefaults
    } from './playground/playground';
    import Preview from './playground/preview.svelte';

    const installCommand = 'bunx @sivir-ui/svelte add message';
    const usageSnippet = `import * as Message from '@sivir-ui/svelte/components/message';

<Message.Root from="assistant" status="idle">
  <Message.Content>
    I found three sources that agree on the release date.
  </Message.Content>
  <Message.Actions aria-label="Assistant response actions">
    <!-- Add labeled actions such as copy or rate -->
  </Message.Actions>
</Message.Root>`;

    const statusOptions: {
        value: MessagePlaygroundStatus;
        label: string;
    }[] = [
        {
            value: 'idle',
            label: 'Idle'
        },
        {
            value: 'error',
            label: 'Error'
        }
    ];

    let settings = $state<MessageSettings>({
        ...messageDefaults
    });

    const heroCode = $derived(messageCode(settings));
    const changed = $derived(changedMessageProps(settings));
    const morphKey = $derived(
        [settings.status, settings.name, settings.timestamp, settings.avatar].join('-')
    );
</script>

{#snippet messageProps()}
    <PropGroup title="Metadata">
        <PropSwitch label="Name" bind:checked={settings.name} />
        <PropSwitch label="Timestamp" bind:checked={settings.timestamp} />
        <PropSwitch label="Avatar" bind:checked={settings.avatar} />
    </PropGroup>
    <PropGroup title="Assistant">
        <PropRow label="Status">
            <PropSegmented
                label="Status"
                size="sm"
                options={statusOptions}
                bind:value={settings.status}
            />
        </PropRow>
    </PropGroup>
{/snippet}

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
        <ComponentPreview code={heroCode} props={messageProps} {changed}>
            <PreviewMorph key={morphKey}>
                <Preview {settings} />
            </PreviewMorph>
        </ComponentPreview>
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
</div>
