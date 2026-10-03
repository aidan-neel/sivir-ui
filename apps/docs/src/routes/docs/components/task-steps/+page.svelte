<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Bare from './examples/bare.svelte';
    import BareSrc from './examples/bare.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add task-steps';
</script>

<svelte:head>
    <title>Sivir · Task Steps</title>
    <meta
        name="description"
        content="An ordered list that shows which step of a multi-step task is running, done, or failed."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Task Steps </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                The running step shows a spinner, and finished steps show a check. Screen readers
                hear one sentence per step, such as “Building, step 2 of 4.”, after the step has
                been current for half a second.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc} refreshable><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            <Typography.InlineCode>current</Typography.InlineCode>
            is the zero-based index of the running step, and steps before it show as done. Set it to
            <Typography.InlineCode>steps.length</Typography.InlineCode>
            when every step has finished, or set
            <Typography.InlineCode>failed</Typography.InlineCode>
            to mark the current step as failed. A step's
            <Typography.InlineCode>meta</Typography.InlineCode>, such as its duration, appears once
            the step is done.
        </Typography.Text>
        <CodeBlock
            lang="svelte"
            copy="overlay"
            code={`import { TaskSteps } from '@sivir-ui/svelte/components/task-steps';

<TaskSteps
  steps={[{ id: 'build', label: 'Building' }, { id: 'test', label: 'Testing' }]}
  current={1}
  label="Deploy progress"
/>`}
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <div id="bare" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Bare</Typography.H3>
            <ComponentPreview code={BareSrc}>
                <Bare />
            </ComponentPreview>
        </div>
    </section>
</div>
