<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Reply from './examples/reply.svelte';
    import ReplySrc from './examples/reply.svelte?raw';
    import SupportNote from './examples/support-note.svelte';
    import SupportNoteSrc from './examples/support-note.svelte?raw';
</script>

<svelte:head>
    <title>Sivir · Toolbar</title>
    <meta
        name="description"
        content="A row of actions with role=toolbar for message composers and reply fields."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Toolbar </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Renders a div with role="toolbar" and pushes its children to opposite ends. Group
                secondary actions on the left and put the send button last.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Pass Toolbar as Textarea's children to render it inside the field's border, below the
            text. Give it an <Typography.InlineCode>aria-label</Typography.InlineCode> that names
            the actions.
        </Typography.Text>
        <CodeBlock
            code={`import ArrowUp from '@lucide/svelte/icons/arrow-up';\nimport Paperclip from '@lucide/svelte/icons/paperclip';\nimport { Button } from '@sivir-ui/svelte/components/button';\nimport { Textarea } from '@sivir-ui/svelte/components/textarea';\nimport { Toolbar } from '@sivir-ui/svelte/components/toolbar';\n\n<Textarea autoresize aria-label="New message">\n\t<Toolbar aria-label="Message actions">\n\t\t<Button variant="ghost" size="icon" aria-label="Attach a file">\n\t\t\t<Paperclip size={14} />\n\t\t</Button>\n\t\t<Button type="submit" size="icon" aria-label="Send message">\n\t\t\t<ArrowUp size={14} />\n\t\t</Button>\n\t</Toolbar>\n</Textarea>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <div id="issue-reply" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Issue reply</Typography.H3>
            <ComponentPreview code={ReplySrc}>
                <Reply />
            </ComponentPreview>
        </div>

        <div id="support-reply" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Support reply</Typography.H3>
            <ComponentPreview code={SupportNoteSrc}>
                <SupportNote />
            </ComponentPreview>
        </div>
    </section>
</div>
