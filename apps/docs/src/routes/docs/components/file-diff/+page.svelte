<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import type { FileDiffTheme } from '@sivir-ui/svelte/components/file-diff';
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
    import Compound from './examples/compound.svelte';
    import CompoundSrc from './examples/compound.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Stacked from './examples/stacked.svelte';
    import StackedSrc from './examples/stacked.svelte?raw';
    import WithoutLineNumbers from './examples/without-line-numbers.svelte';
    import WithoutLineNumbersSrc from './examples/without-line-numbers.svelte?raw';
    import {
        changedFileDiffProps,
        type FileDiffSettings,
        fileDiffCode,
        fileDiffDefaults
    } from './playground/playground';

    type Option<T extends string> = {
        value: T;
        label: string;
    };

    const installCommand = 'bunx @sivir-ui/svelte add file-diff';

    const themeOptions: Option<FileDiffTheme>[] = [
        {
            value: 'sivir',
            label: 'Sivir'
        },
        {
            value: 'custom',
            label: 'Custom'
        }
    ];

    let settings = $state<FileDiffSettings>({
        ...fileDiffDefaults
    });

    const heroCode = $derived(fileDiffCode(HeroSrc, settings));
    const changed = $derived(changedFileDiffProps(settings));

    const usageSnippet = `import * as FileDiff from '@sivir-ui/svelte/components/file-diff';

<FileDiff.Root file="src/auth.ts" lang="ts" diff={[
  { type: 'context', oldLineNumber: 12, newLineNumber: 12, content: 'export function getToken() {' },
  { type: 'remove', oldLineNumber: 13, content: '  return localStorage.token;' },
  { type: 'add', newLineNumber: 13, content: '  const t = cookies.get("session");' },
]} />`;
</script>

{#snippet heroProps()}
    <PropGroup title="Appearance">
        <PropRow label="Theme">
            <PropSegmented label="Theme" options={themeOptions} bind:value={settings.theme} />
        </PropRow>
        <PropSwitch label="Line numbers" bind:checked={settings.showLineNumbers} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · File Diff</title>
    <meta
        name="description"
        content="A unified diff for one file, with syntax-highlighted rows and addition and deletion counts."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> File Diff </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Rows are highlighted with highlight.js in a built-in GitHub palette. Set
                theme="custom" to drop those colors and load your own highlight.js stylesheet.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={heroProps} {changed}>
            <Hero showLineNumbers={settings.showLineNumbers} theme={settings.theme} />
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
        <Typography.Text variant="supporting">
            The component needs
            <Typography.InlineCode>highlight.js</Typography.InlineCode>. The add command offers to
            install it when it's missing. To install it yourself, run:
        </Typography.Text>
        <InstallCommand command="bun add highlight.js" />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Pass a <Typography.InlineCode>diff</Typography.InlineCode> array and Root renders the
            top bar and every row. The addition and deletion counts come from the
            <Typography.InlineCode>add</Typography.InlineCode>
            and
            <Typography.InlineCode>remove</Typography.InlineCode>
            lines unless you pass
            <Typography.InlineCode>additions</Typography.InlineCode>
            and
            <Typography.InlineCode>deletions</Typography.InlineCode>.
            <Typography.InlineCode>lang</Typography.InlineCode>
            takes a highlight.js language name or a common alias such as
            <Typography.InlineCode>ts</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
    </section>

    <!-- ─── Example Descriptions ──────────────────────────────────── -->
    {#snippet compoundDescription()}
        <Typography.Text variant="supporting">
            Leave out <Typography.InlineCode>diff</Typography.InlineCode> and compose
            <Typography.InlineCode>TopBar</Typography.InlineCode>,
            <Typography.InlineCode>Content</Typography.InlineCode>, and
            <Typography.InlineCode>Row</Typography.InlineCode>
            yourself. Root can't count rows you compose, so pass
            <Typography.InlineCode>additions</Typography.InlineCode>
            and
            <Typography.InlineCode>deletions</Typography.InlineCode>. Children replace the TopBar's
            default filename and counts; add
            <Typography.InlineCode>Filename</Typography.InlineCode>
            and
            <Typography.InlineCode>PlusMinus</Typography.InlineCode>
            back next to your own actions.
        </Typography.Text>
    {/snippet}

    {#snippet withoutLineNumbersDescription()}
        <Typography.Text variant="supporting">
            Set <Typography.InlineCode>showLineNumbers</Typography.InlineCode> to false to hide both
            gutters. The + and − column stays, so changes are readable without color.
        </Typography.Text>
    {/snippet}

    {#snippet stackedDescription()}
        <Typography.Text variant="supporting">
            Render one Root per file, as in a pull request. Each Root has its own language and
            counts.
        </Typography.Text>
    {/snippet}

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="compound" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Composed parts </Typography.H3>
            <ComponentPreview code={CompoundSrc}>
                <Compound />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render compoundDescription()}
            </div>
        </div>

        <div id="without-line-numbers" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Without line numbers </Typography.H3>
            <ComponentPreview code={WithoutLineNumbersSrc}>
                <WithoutLineNumbers />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render withoutLineNumbersDescription()}
            </div>
        </div>

        <div id="stacked" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Stacked files </Typography.H3>
            <ComponentPreview code={StackedSrc}>
                <Stacked />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render stackedDescription()}
            </div>
        </div>
    </section>
</div>
