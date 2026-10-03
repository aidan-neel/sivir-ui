<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { resolve } from '$app/paths';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    const packageInstall = `bun add @sivir-ui/svelte
# npm i @sivir-ui/svelte
# pnpm add @sivir-ui/svelte`;

    const packageCss = `@import '@sivir-ui/svelte/ui.css';`;

    const packageUse = `<script>
  import { Button } from '@sivir-ui/svelte';
<${'/'}script>

<Button>Get started</Button>`;

    const cliCss = `/* src/routes/layout.css */
@import '../lib/sivir/ui.css';`;

    const cliAdd = `bunx @sivir-ui/svelte add button
bunx @sivir-ui/svelte list`;

    const cliUse = `<script>
  import { Button } from '$lib/sivir/components/button';
<${'/'}script>

<Button>Get started</Button>`;
</script>

<svelte:head>
    <title>Sivir · Installation</title>
    <meta name="description" content="Install Sivir UI with the npm package or the sivir CLI." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-16">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1 class="m-0">Installation</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Choose the package to get updates through upgrades, or the CLI to own and edit
                component source. Both load the same stylesheet, ui.css.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="prerequisites" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Prerequisites</Typography.H2>
        <ul
            class="m-0 flex list-disc flex-col gap-1.5 pl-5 [font-size:var(--font-size-body)] text-foreground leading-relaxed"
        >
            <li>Svelte 5 (the CLI defaults assume SvelteKit)</li>
            <li>Tailwind CSS v4</li>
        </ul>
    </section>

    <section id="package-import" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Option A: Package import</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Install the library and import components from
            <Typography.InlineCode>@sivir-ui/svelte</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock code={packageInstall} lang="shell" copy="overlay" />
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Import the stylesheet once in your root CSS file, in place of
            <Typography.InlineCode>@import 'tailwindcss';</Typography.InlineCode>. It imports
            Tailwind for you:
        </Typography.Text>
        <CodeBlock code={packageCss} lang="css" copy="overlay" />
        <Typography.Text variant="body" class="m-0 max-w-2xl">Use a component:</Typography.Text>
        <CodeBlock code={packageUse} lang="svelte" copy="overlay" />
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Compound components use a namespace export (for example
            <Typography.InlineCode>Modal</Typography.InlineCode>
            with
            <Typography.InlineCode>Modal.Root</Typography.InlineCode>,
            <Typography.InlineCode>Modal.Content</Typography.InlineCode>, …).
        </Typography.Text>
    </section>

    <section id="cli-source-copy" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Option B: CLI source copy</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            The
            <Typography.InlineCode>sivir</Typography.InlineCode>
            binary ships in
            <Typography.InlineCode>@sivir-ui/svelte</Typography.InlineCode>, so these commands run
            it with
            <Typography.InlineCode>bunx @sivir-ui/svelte</Typography.InlineCode>. It copies
            component source into your project. These commands need Bun 1.3.14 or later. With npm,
            use
            <Typography.InlineCode>npx @sivir-ui/svelte</Typography.InlineCode>.
        </Typography.Text>

        <Typography.H3 class="m-0 docs-subsection-heading">
            1. Create a project (optional)
        </Typography.H3>
        <CodeBlock code="bunx sv create my-app" lang="shell" copy="overlay" />

        <Typography.H3 class="m-0 docs-subsection-heading">2. Add Tailwind v4</Typography.H3>
        <CodeBlock code="cd my-app && bunx sv add tailwindcss" lang="shell" copy="overlay" />

        <Typography.H3 class="m-0 docs-subsection-heading">3. Initialize Sivir</Typography.H3>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Copies <Typography.InlineCode>ui.css</Typography.InlineCode> and shared utilities into
            <Typography.InlineCode>src/lib/sivir/</Typography.InlineCode>, writes
            <Typography.InlineCode>sivir.json</Typography.InlineCode>, and installs the shared
            dependencies.
            <Typography.InlineCode>-y</Typography.InlineCode>
            accepts the default directory and import alias and skips the confirmations for
            installing dependencies and editing your stylesheet.
        </Typography.Text>
        <CodeBlock code="bunx @sivir-ui/svelte init -y" lang="shell" copy="overlay" />

        <Typography.H3 class="m-0 docs-subsection-heading">
            4. Import the stylesheet
        </Typography.H3>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            <Typography.InlineCode>ui.css</Typography.InlineCode>
            includes Tailwind, so it replaces
            <Typography.InlineCode>@import 'tailwindcss';</Typography.InlineCode>.
            <Typography.InlineCode>init</Typography.InlineCode>
            makes this change in the stylesheet
            <Typography.InlineCode>sv add tailwindcss</Typography.InlineCode>
            creates. Make it yourself if your root stylesheet lives elsewhere:
        </Typography.Text>
        <CodeBlock code={cliCss} lang="css" copy="overlay" />

        <Typography.H3 class="m-0 docs-subsection-heading">5. Add components</Typography.H3>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            <Typography.InlineCode>add</Typography.InlineCode>
            copies each component with its dependencies and offers to install the npm packages they
            need. Pass
            <Typography.InlineCode>'*'</Typography.InlineCode>, quoted, to add every component.
        </Typography.Text>
        <CodeBlock code={cliAdd} lang="shell" copy="overlay" />

        <Typography.H3 class="m-0 docs-subsection-heading">6. Use them</Typography.H3>
        <CodeBlock code={cliUse} lang="svelte" copy="overlay" />
    </section>

    <section id="notes" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Notes</Typography.H2>
        <ul
            class="m-0 flex list-disc flex-col gap-1.5 pl-5 [font-size:var(--font-size-body)] text-foreground leading-relaxed"
        >
            <li>
                Tailwind v3 is not supported. Sivir needs v4
                <Typography.InlineCode>@theme</Typography.InlineCode>
                and
                <Typography.InlineCode>color-mix</Typography.InlineCode>.
            </li>
            <li>
                Dark mode applies under a
                <Typography.InlineCode>.dark</Typography.InlineCode>
                class on
                <Typography.InlineCode>&lt;html&gt;</Typography.InlineCode>. Sivir reads the class
                but does not toggle it.
            </li>
            <li>
                In a CLI project, install a built-in theme preset with
                <Typography.InlineCode
                    >bunx @sivir-ui/svelte add theme &lt;slug&gt;</Typography.InlineCode
                >
                (for example <Typography.InlineCode>raven</Typography.InlineCode>). It writes
                <Typography.InlineCode>theme.css</Typography.InlineCode>
                next to <Typography.InlineCode>ui.css</Typography.InlineCode>; import it after
                <Typography.InlineCode>ui.css</Typography.InlineCode>.
            </li>
        </ul>
    </section>

    <section id="next" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Next</Typography.H2>
        <Typography.Text variant="body" class="m-0">
            <a class="text-foreground underline underline-offset-2" href={resolve('/docs/theming')}
                >Theming</a
            >
            ·
            <a
                class="text-foreground underline underline-offset-2"
                href={resolve('/docs/components')}
                >Components</a
            >
        </Typography.Text>
    </section>
</div>
