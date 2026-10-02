<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Idle from './examples/idle.svelte';
    import IdleSrc from './examples/idle.svelte?raw';
    import ErrorExample from './examples/state-error.svelte';
    import ErrorSrc from './examples/state-error.svelte?raw';
    import Submitting from './examples/submitting.svelte';
    import SubmittingSrc from './examples/submitting.svelte?raw';
    import ToolbarInset from './examples/toolbar-inset.svelte';
    import ToolbarInsetSrc from './examples/toolbar-inset.svelte?raw';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add composer';
</script>

<svelte:head>
    <title>Sivir · Composer</title>
    <meta
        name="description"
        content="A prompt form with an auto-resizing input, a toolbar for controls, and a send button that switches to stop."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Composer </Typography.H1>

            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                The input grows with its text. While a response generates, the submit button becomes
                a stop button, or a queue button once the user starts typing again.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            <Typography.InlineCode>onSubmit</Typography.InlineCode>
            is required. Empty prompts are not submitted unless you set
            <Typography.InlineCode>allowEmpty</Typography.InlineCode>. While an async
            <Typography.InlineCode>onSubmit</Typography.InlineCode>
            runs, the input is read-only and the submit button shows a pending state. Pass
            <Typography.InlineCode>generating</Typography.InlineCode>
            and
            <Typography.InlineCode>onStop</Typography.InlineCode>
            to show the stop button while a response streams.
        </Typography.Text>
        <CodeBlock
            code={`import * as Composer from '@sivir-ui/svelte/components/composer';

let value = $state('');

async function sendPrompt(prompt: string) {
  await chat.send(prompt);
  value = '';
}

<Composer.Root bind:value onSubmit={sendPrompt}>
  <Composer.Input placeholder="Ask about this repository..." />
  <Composer.Toolbar>
    <Composer.Actions>
      <!-- Attachment, model, or permission controls -->
    </Composer.Actions>
    <Composer.Submit />
  </Composer.Toolbar>
</Composer.Root>`}
            lang="svelte"
            copy="overlay"
        />
        <Typography.Text variant="supporting">
            To accept files, wrap Root in
            <Typography.InlineCode>Attachment.Root</Typography.InlineCode>
            and place
            <Typography.InlineCode>Attachment.List</Typography.InlineCode>
            directly before
            <Typography.InlineCode>Input</Typography.InlineCode>. Dropped and pasted files show as
            chips beside the prompt.
        </Typography.Text>
        <Typography.Text variant="supporting">
            By default, <Shortcut shortcut="enter" /> submits and
            <Shortcut shortcut="shift+enter" />
            inserts a new line. Set
            <Typography.InlineCode>submitOnEnter={false}</Typography.InlineCode>
            on
            <Typography.InlineCode>Input</Typography.InlineCode>
            when Enter should always create a new line.
        </Typography.Text>
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Set <Typography.InlineCode>status</Typography.InlineCode> when your app tracks
                submission itself. <Typography.InlineCode>"error"</Typography.InlineCode> shows
                “Message could not be sent.” above the form.
            </Typography.Text>
        </div>

        <div id="idle" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Idle</Typography.H3>
            <ComponentPreview code={IdleSrc}><Idle /></ComponentPreview>
        </div>

        <div id="submitting" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Submitting</Typography.H3>
            <ComponentPreview code={SubmittingSrc}><Submitting /></ComponentPreview>
        </div>

        <div id="error" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Error</Typography.H3>
            <ComponentPreview code={ErrorSrc} refreshable><ErrorExample /></ComponentPreview>
        </div>

        <div id="toolbar-inset" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Toolbar inset</Typography.H3>
            <Typography.Text variant="supporting">
                By default the toolbar shares the input's surface. Set
                <Typography.InlineCode>variant="inset"</Typography.InlineCode>
                on <Typography.InlineCode>Toolbar</Typography.InlineCode> to place it in a recessed
                tray along the bottom edge.
            </Typography.Text>
            <ComponentPreview code={ToolbarInsetSrc}><ToolbarInset /></ComponentPreview>
        </div>
    </section>
</div>
