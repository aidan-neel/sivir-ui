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
    import CopyInline from './examples/copy-inline.svelte';
    import CopyInlineSrc from './examples/copy-inline.svelte?raw';
    import CopyOverlay from './examples/copy-overlay.svelte';
    import CopyOverlaySrc from './examples/copy-overlay.svelte?raw';
    import CustomActions from './examples/custom-actions.svelte';
    import CustomActionsSrc from './examples/custom-actions.svelte?raw';
    import Hero from './examples/hero.svelte';
    import LineNumbers from './examples/line-numbers.svelte';
    import LineNumbersSrc from './examples/line-numbers.svelte?raw';
    import MultiLanguage from './examples/multi-language.svelte';
    import MultiLanguageSrc from './examples/multi-language.svelte?raw';
    import Single from './examples/single.svelte';
    import SingleSrc from './examples/single.svelte?raw';

    import {
        type CodeBlockSettings,
        changedCodeBlockProps,
        codeBlockCode,
        codeBlockCopyOptions,
        codeBlockDefaults
    } from './playground/playground';

    const installCommand = 'bunx @sivir-ui/svelte add code-block';

    let settings = $state<CodeBlockSettings>({
        ...codeBlockDefaults
    });

    const heroCode = $derived(codeBlockCode(settings));
    const changed = $derived(changedCodeBlockProps(settings));

    const usageSnippet = `import { CodeBlock } from '@sivir-ui/svelte/components/code-block';

<CodeBlock
  value="javascript"
  tabs={[
    { label: 'Python',     lang: 'python',     code: pyCode },
    { label: 'JavaScript', lang: 'javascript', code: jsCode },
  ]}
/>`;

    const customThemeSnippet = `import 'highlight.js/styles/github-dark.css';
import { CodeBlock } from '@sivir-ui/svelte/components/code-block';

<CodeBlock code={code} lang="typescript" theme="custom" />`;
</script>

{#snippet heroProps()}
    <PropGroup title="Content">
        <PropSwitch label="Line numbers" bind:checked={settings.showLineNumbers} />
    </PropGroup>
    <PropGroup title="Copy">
        <PropRow label="Placement">
            <PropSegmented
                label="Copy placement"
                options={codeBlockCopyOptions}
                bind:value={settings.copy}
                size="sm"
            />
        </PropRow>
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · Code Block</title>
    <meta
        name="description"
        content="A syntax-highlighted code viewer with language tabs and a copy button, built on highlight.js."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Code Block </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Use the shorthand with <Typography.InlineCode>code</Typography.InlineCode> or
                <Typography.InlineCode>tabs</Typography.InlineCode>, or compose Header, List,
                Actions, and Content yourself. Copy copies the raw source of the active tab.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={heroProps} {changed}>
            <Hero showLineNumbers={settings.showLineNumbers} copy={settings.copy} />
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
        <Typography.Text variant="supporting">
            The component depends on
            <Typography.InlineCode>highlight.js</Typography.InlineCode>. Install it if your project
            doesn't have it yet:
        </Typography.Text>
        <InstallCommand command="bun add highlight.js" />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Pass <Typography.InlineCode>code</Typography.InlineCode> and
            <Typography.InlineCode>lang</Typography.InlineCode>
            for one snippet, or a
            <Typography.InlineCode>tabs</Typography.InlineCode>
            array for several. Root's <Typography.InlineCode>value</Typography.InlineCode> picks the
            open tab by matching each tab's <Typography.InlineCode>value</Typography.InlineCode>,
            which defaults to its <Typography.InlineCode>lang</Typography.InlineCode>. It is
            bindable and starts on the first tab.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
        <Typography.Text variant="supporting">
            The default theme colors tokens with GitHub light and GitHub dark, and theme presets set
            their own palette. To use a
            <Typography.InlineCode>highlight.js</Typography.InlineCode>
            theme instead, set
            <Typography.InlineCode>theme="custom"</Typography.InlineCode>
            and load its stylesheet. The component then skips its own token colors.
        </Typography.Text>
        <CodeBlock code={customThemeSnippet} lang="svelte" copy="overlay" />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="single" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Single snippet </Typography.H3>
            <ComponentPreview code={SingleSrc}>
                <Single />
            </ComponentPreview>
        </div>

        <div id="multi-language" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Multiple languages </Typography.H3>
            <ComponentPreview code={MultiLanguageSrc}>
                <MultiLanguage />
            </ComponentPreview>
        </div>

        <div id="line-numbers" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Line numbers </Typography.H3>
            <ComponentPreview code={LineNumbersSrc}>
                <LineNumbers />
            </ComponentPreview>
        </div>

        <div id="custom-actions" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Custom actions </Typography.H3>
            <ComponentPreview code={CustomActionsSrc}>
                <CustomActions />
            </ComponentPreview>
        </div>

        <div id="copy-overlay" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Copy placement: overlay </Typography.H3>
            <ComponentPreview code={CopyOverlaySrc}>
                <CopyOverlay />
            </ComponentPreview>
        </div>

        <div id="copy-inline" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Copy placement: inline </Typography.H3>
            <ComponentPreview code={CopyInlineSrc}>
                <CopyInline />
            </ComponentPreview>
        </div>
    </section>
</div>
