<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import ComposerExample from './examples/composer.svelte';
    import ComposerExampleSrc from './examples/composer.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Rejections from './examples/rejections.svelte';
    import RejectionsSrc from './examples/rejections.svelte?raw';
    import StatusVariants from './examples/status-variants.svelte';
    import StatusVariantsSrc from './examples/status-variants.svelte?raw';
    import UploadProgress from './examples/upload-progress.svelte';
    import UploadProgressSrc from './examples/upload-progress.svelte?raw';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add attachment';
    const usageSnippet = `import * as Attachment from '@sivir-ui/svelte/components/attachment';
import type { AttachmentRejection } from '@sivir-ui/svelte/components/attachment';

let files: File[] = $state([]);

function handleReject(rejections: AttachmentRejection[]) {
  console.log(rejections);
}

<Attachment.Root
  bind:files
  accept="image/*,.pdf"
  maxFiles={3}
  maxSize={5 * 1024 * 1024}
  onReject={handleReject}
>
  <Attachment.Trigger>Choose files</Attachment.Trigger>
  <Attachment.List />
</Attachment.Root>`;
    const compositionSnippet = `import * as Attachment from '@sivir-ui/svelte/components/attachment';

<Attachment.List>
  {#snippet children(file)}
    <Attachment.Item
      {file}
      status={uploads.get(file)?.status}
      progress={uploads.get(file)?.progress}
    >
      <Attachment.Preview />
      <Attachment.Name />
      <Attachment.Status />
      <Attachment.Remove />
    </Attachment.Item>
  {/snippet}
</Attachment.List>`;
</script>

<svelte:head>
    <title>Sivir · Attachment</title>
    <meta
        name="description"
        content="A file picker that accepts drops and pastes, enforces type, size, and count limits, and lists the selected files."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Attachment </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Users choose, drop, or paste files, and each accepted file appears as a card with a
                preview and a remove button. Attachment does not upload; your app sends the files.
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
            Bind <Typography.InlineCode>files</Typography.InlineCode> on Root to read the selected
            <Typography.InlineCode>File</Typography.InlineCode>
            objects. Files arrive from the picker, from a drop anywhere on Root, or from a paste
            into a focused field inside it. Duplicates and files that break
            <Typography.InlineCode>accept</Typography.InlineCode>,
            <Typography.InlineCode>maxSize</Typography.InlineCode>, or
            <Typography.InlineCode>maxFiles</Typography.InlineCode>
            are not added and are passed to
            <Typography.InlineCode>onReject</Typography.InlineCode>. Your app owns uploading and
            upload status.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
        <Typography.Text variant="supporting">
            While files are dragged over the root, an overlay confirms the drop. When the drag
            already breaks a rule the browser can check, such as the file limit or a MIME type in
            <Typography.InlineCode>accept</Typography.InlineCode>, the overlay says why before the
            drop. Set
            <Typography.InlineCode>{'addOnPaste={false}'}</Typography.InlineCode>
            to leave pasted files to your own handler.
        </Typography.Text>
    </section>

    <section id="composition" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Composition </Typography.H2>
        <Typography.Text variant="supporting">
            <Typography.InlineCode>List</Typography.InlineCode>
            renders a default
            <Typography.InlineCode>Item</Typography.InlineCode>
            for each file. Pass a
            <Typography.InlineCode>children</Typography.InlineCode>
            snippet to render your own item, which receives the file. An
            <Typography.InlineCode>Item</Typography.InlineCode>
            without children renders
            <Typography.InlineCode>Preview</Typography.InlineCode>,
            <Typography.InlineCode>Name</Typography.InlineCode>,
            <Typography.InlineCode>Status</Typography.InlineCode>, and
            <Typography.InlineCode>Remove</Typography.InlineCode>. Compose them yourself to omit,
            reorder, or add controls; extra children sit beside the remove button.
        </Typography.Text>
        <CodeBlock code={compositionSnippet} lang="svelte" copy="overlay" />
        <Typography.Text variant="supporting">
            Inside a root,
            <Typography.InlineCode>Remove</Typography.InlineCode>
            removes the file from the bound list and moves focus to a neighboring file, or back to
            the trigger when the list empties. Pass
            <Typography.InlineCode>onRemove</Typography.InlineCode>
            to an item to handle removal yourself. Items animate in and out and the list reflows,
            using the theme's motion tokens. Reduced motion turns the animation off.
        </Typography.Text>
        <Typography.Text variant="supporting">
            The list is a grid that fits as many columns of at least 14rem as the space allows and
            falls back to one column on narrow screens. Add
            <Typography.InlineCode>grid-cols-1</Typography.InlineCode>
            to its class for full-width rows.
        </Typography.Text>
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="upload-progress" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Upload progress </Typography.H3>
            <Typography.Text variant="supporting">
                Keep upload state in a map keyed by file and pass it to each item. In this demo the
                second file fails its first attempt, and a retry button is composed beside
                <Typography.InlineCode>Remove</Typography.InlineCode>
                only while the item is in error.
            </Typography.Text>
            <ComponentPreview code={UploadProgressSrc}><UploadProgress /></ComponentPreview>
        </div>

        <div id="rejections" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Rejections </Typography.H3>
            <Typography.Text variant="supporting">
                Each rejection carries a typed
                <Typography.InlineCode>code</Typography.InlineCode>
                and a
                <Typography.InlineCode>reason</Typography.InlineCode>
                sentence such as “This file is larger than the 1.0 MB limit.” Show the reason next
                to the trigger. Root also announces added, removed, and rejected files to screen
                readers.
            </Typography.Text>
            <ComponentPreview code={RejectionsSrc}><Rejections /></ComponentPreview>
        </div>

        <div id="composer" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> In a composer </Typography.H3>
            <Typography.Text variant="supporting">
                Wrap the composer in Root so files can be dropped anywhere on it and screenshots can
                be pasted into the prompt. Place List directly before Composer.Input: inside a
                composer, attachments render as slim chips on the prompt's first line, and the text
                moves below them once it wraps.
            </Typography.Text>
            <ComponentPreview code={ComposerExampleSrc}><ComposerExample /></ComponentPreview>
        </div>

        <div id="status-variants" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Upload status </Typography.H3>
            <Typography.Text variant="supporting">
                Render standalone items outside a root when another part of your interface owns the
                file list.
            </Typography.Text>
            <ComponentPreview code={StatusVariantsSrc}><StatusVariants /></ComponentPreview>
        </div>
    </section>
</div>
