<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import ComposerTakeover from './examples/composer-takeover.svelte';
    import ComposerTakeoverSrc from './examples/composer-takeover.svelte?raw';
    import FreeText from './examples/free-text.svelte';
    import FreeTextSrc from './examples/free-text.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import MultipleChoice from './examples/multiple-choice.svelte';
    import MultipleChoiceSrc from './examples/multiple-choice.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add question';
    const usageSnippet = `import * as Question from '@sivir-ui/svelte/components/question';
import type { QuestionAnswer } from '@sivir-ui/svelte/components/question';

let answer: QuestionAnswer | undefined = $state();

<Question.Root
  variant="inset"
  bind:value={answer}
  onSubmit={(value) => continueAgent(value)}
  onCancel={() => skipQuestion()}
>
  <Question.Content>
    <Question.Title>Which environment should I deploy to?</Question.Title>
    <Question.Description>Production deploys need a second reviewer.</Question.Description>
    <Question.Options>
      <Question.Option value="preview" label="Preview" />
      <Question.Option value="production" label="Production" />
    </Question.Options>
  </Question.Content>
  <Question.Actions>
    <Question.Cancel>Skip question</Question.Cancel>
    <Question.Submit />
  </Question.Actions>
</Question.Root>`;
</script>

<svelte:head>
    <title>Sivir · Question</title>
    <meta
        name="description"
        content="A form an agent uses to ask the user a single-choice, multiple-choice, or free-text question."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Question </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                The question, its answer controls, and the cancel and submit buttons render inside a
                Card. Ask one question, or step through several in the same card.
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
            is required and receives the answer.
            <Typography.InlineCode>onCancel</Typography.InlineCode>
            runs when
            <Typography.InlineCode>Question.Cancel</Typography.InlineCode>
            is pressed. To ask mid-conversation, render
            <Typography.InlineCode>Question.Root</Typography.InlineCode>
            in place of <Typography.InlineCode>Composer.Root</Typography.InlineCode> and keep the
            composer's value in their shared parent, so the unsent draft survives the swap.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
        <Typography.Text variant="supporting">
            <Typography.InlineCode>type</Typography.InlineCode>
            defaults to
            <Typography.InlineCode>"single"</Typography.InlineCode>, which answers with a string.
            Use <Typography.InlineCode>type="multiple"</Typography.InlineCode>
            for a string array, or
            <Typography.InlineCode>type="text"</Typography.InlineCode>
            with
            <Typography.InlineCode>Question.Input</Typography.InlineCode>. An answer is required
            unless you set <Typography.InlineCode>{'required={false}'}</Typography.InlineCode>;
            submitting without one shows a validation message. Async submit handlers are awaited and
            cannot run twice while unresolved. Changing
            <Typography.InlineCode>type</Typography.InlineCode>
            resets the bound answer to the new type's empty value.
        </Typography.Text>
        <Typography.Text variant="supporting">
            Each option shows its position as a key hint. While focus is inside the question and not
            in a text field, pressing 1 through 9 selects that option, or toggles it with
            <Typography.InlineCode>type="multiple"</Typography.InlineCode>.
        </Typography.Text>
    </section>

    <section id="composition" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Composition</Typography.H2>
        <Typography.Text variant="supporting">
            <Typography.InlineCode>variant="inset"</Typography.InlineCode>
            on
            <Typography.InlineCode>Question.Root</Typography.InlineCode>
            places the content on a recessed surface inside the Card frame. The default variant is a
            plain Card. Place
            <Typography.InlineCode>Question.Actions</Typography.InlineCode>
            after
            <Typography.InlineCode>Question.Content</Typography.InlineCode>
            to keep the buttons in the footer.
            <Typography.InlineCode>Question.Description</Typography.InlineCode>
            and
            <Typography.InlineCode>Question.Actions</Typography.InlineCode>
            are optional.
        </Typography.Text>
        <CodeBlock
            lang="svelte"
            copy="overlay"
            code={`import * as Question from '@sivir-ui/svelte/components/question';

<Question.Root variant="inset" bind:value={answer} onSubmit={next}>
  <Question.Content step={index}>
    <Question.Title>{question.title}</Question.Title>
    <Question.Options>
      {#each question.options as option (option.value)}
        <Question.Option {...option} />
      {/each}
    </Question.Options>
  </Question.Content>
  <Question.Actions class="justify-between">
    <Question.Cancel disabled={index === 0} onclick={(event) => {
      event.preventDefault();
      back();
    }}>Back</Question.Cancel>
    <Question.Submit label="Next" />
  </Question.Actions>
</Question.Root>`}
        />
        <Typography.Text variant="supporting">
            <Typography.InlineCode>Question.Content</Typography.InlineCode>
            groups the title, description, and answer controls in one fieldset. Pass the current
            step index as <Typography.InlineCode>step</Typography.InlineCode> to animate between
            questions: the outgoing step blurs away, the next one slides in from the direction of
            travel, and the height eases to fit. A higher index moves forward and a lower index
            moves back. Without <Typography.InlineCode>step</Typography.InlineCode>, content changes
            in place.
        </Typography.Text>
        <Typography.Text variant="supporting">
            The motion reads theme tokens:
            <Typography.InlineCode>--motion-duration-step-in</Typography.InlineCode>,
            <Typography.InlineCode>--motion-duration-step-out</Typography.InlineCode>,
            <Typography.InlineCode>--motion-step-x</Typography.InlineCode>, and
            <Typography.InlineCode>--motion-step-blur</Typography.InlineCode>. The theme’s motion
            preset scales the durations, and reduced motion turns the animation off.
        </Typography.Text>
        <Typography.Text variant="supporting">
            Content animates step changes but does not store answers or handle navigation, so keep
            the step index and each answer in the parent, as in the example above. Keep a flow to
            one answer type, or key the Root per question when mixing types, because changing
            <Typography.InlineCode>type</Typography.InlineCode>
            on an existing Root clears its answer. When Cancel acts as Back, call
            <Typography.InlineCode>event.preventDefault()</Typography.InlineCode>
            in its
            <Typography.InlineCode>onclick</Typography.InlineCode>
            so the Root's
            <Typography.InlineCode>onCancel</Typography.InlineCode>
            does not run.
        </Typography.Text>
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>

        <div id="multiple-choice" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Multiple choice</Typography.H3>
            <ComponentPreview code={MultipleChoiceSrc}><MultipleChoice /></ComponentPreview>
        </div>

        <div id="free-text" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Free text</Typography.H3>
            <ComponentPreview code={FreeTextSrc}><FreeText /></ComponentPreview>
        </div>

        <div id="composer-takeover" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Conversation takeover</Typography.H3>
            <Typography.Text variant="supporting">
                Answer or skip the question to restore the composer with its draft intact.
            </Typography.Text>
            <ComponentPreview code={ComposerTakeoverSrc}>
                <ComposerTakeover />
            </ComponentPreview>
        </div>
    </section>
</div>
