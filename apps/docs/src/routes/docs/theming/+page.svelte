<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { resolve } from '$app/paths';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    const overrideCss = `@theme {
  --color-primary: #155eef;
  --color-background: #fcfcfd;
  --color-foreground: #101828;
  --radius-lg: 0.55rem;
  --font-sans: 'DM Sans', sans-serif;
}

.dark {
  --color-background: #0d1118;
  --color-foreground: #f5f7fb;
  --color-primary: #7aa2ff;
}`;

    const themeImport = `/* src/routes/layout.css */
@import '../lib/sivir/ui.css';
@import '../lib/sivir/theme.css';`;

    const classExample = '<Button class="w-full rounded-2xl">Continue</Button>';

    const dataUiExample = `[data-ui='button'][data-variant='primary'] {
  border-radius: 999px;
}

[data-ui='badge'][data-variant='secondary'] {
  text-transform: uppercase;
}`;

    const sourceExample = `# after: bunx --package @sivir-ui/svelte sivir add button
src/lib/sivir/components/button/
├── button.svelte
├── index.ts
└── variants.ts`;
</script>

<svelte:head>
    <title>Sivir · Theming</title>
    <meta
        name="description"
        content="Theme and style Sivir UI with CSS variables, classes, and data-ui selectors."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-16">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1 class="m-0">Theming</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Components read color, type, radius, density, motion, and elevation from CSS
                variables. Change a token to restyle every component, or style one instance with
                classes and data-ui selectors.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="where-tokens-live" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Where tokens live</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Package installs use
            <Typography.InlineCode>@sivir-ui/svelte/ui.css</Typography.InlineCode>. CLI installs use
            <Typography.InlineCode>src/lib/sivir/ui.css</Typography.InlineCode>. Both define the
            same tokens.
        </Typography.Text>
    </section>

    <section id="theme-studio" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Studio</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            The
            <a class="text-foreground underline underline-offset-2" href={resolve('/studio')}
                >Studio</a
            >
            builds a theme visually. Start from a built-in preset, then adjust brand color, neutral
            temperature, radius, density, motion, fonts, header size, per-role font weights,
            per-mode foundation colors, and chrome flags. The Tokens tab overrides individual theme
            variables, separately for light and dark mode where they differ.
        </Typography.Text>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Export the theme as <Typography.InlineCode>theme.css</Typography.InlineCode> for your
            app, or as JSON to load it again later. The Studio keeps your draft in local storage
            between visits.
        </Typography.Text>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Publish a draft to share it on the
            <a class="text-foreground underline underline-offset-2" href={resolve('/themes')}
                >themes page</a
            >, where anyone can preview it and install it by slug. The browser that publishes a
            theme keeps its edit key, so only that browser can publish updates or unpublish it. Open
            any theme in the Studio with
            <Typography.InlineCode>/studio?theme=&lt;slug&gt;</Typography.InlineCode>
            to start a new draft from it.
        </Typography.Text>
    </section>

    <section id="override-tokens" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Override tokens</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Set values in your app CSS after importing Sivir’s sheet. Light defaults go in
            <Typography.InlineCode>@theme</Typography.InlineCode>. Dark values go under
            <Typography.InlineCode>.dark</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock code={overrideCss} lang="css" copy="overlay" />
    </section>

    <section id="useful-tokens" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Useful public tokens</Typography.H2>
        <ul
            class="m-0 flex list-disc flex-col gap-2 pl-5 text-[1rem] text-foreground leading-relaxed"
        >
            <li>
                Color:
                <Typography.InlineCode>--color-background</Typography.InlineCode>,
                <Typography.InlineCode>--color-card</Typography.InlineCode>,
                <Typography.InlineCode>--color-panel</Typography.InlineCode>,
                <Typography.InlineCode>--color-secondary</Typography.InlineCode>,
                <Typography.InlineCode>--color-foreground</Typography.InlineCode>,
                <Typography.InlineCode>--color-foreground-muted</Typography.InlineCode>,
                <Typography.InlineCode>--color-primary</Typography.InlineCode>,
                <Typography.InlineCode>--color-on-primary</Typography.InlineCode>,
                <Typography.InlineCode>--color-button-foreground</Typography.InlineCode>,
                <Typography.InlineCode>--color-border</Typography.InlineCode>,
                <Typography.InlineCode>--color-input</Typography.InlineCode>,
                <Typography.InlineCode>--color-ring</Typography.InlineCode>
            </li>
            <li>
                Type:
                <Typography.InlineCode>--font-sans</Typography.InlineCode>,
                <Typography.InlineCode>--font-mono</Typography.InlineCode>,
                <Typography.InlineCode>--font-header</Typography.InlineCode>,
                <Typography.InlineCode>--font-size-header</Typography.InlineCode>, and role weights
                like <Typography.InlineCode>--font-weight-body</Typography.InlineCode>,
                <Typography.InlineCode>--font-weight-label</Typography.InlineCode>,
                <Typography.InlineCode>--font-weight-button</Typography.InlineCode>
            </li>
            <li>
                Radius and density:
                <Typography.InlineCode>--radius-sm</Typography.InlineCode>,
                <Typography.InlineCode>--radius-md</Typography.InlineCode>,
                <Typography.InlineCode>--radius-lg</Typography.InlineCode>,
                <Typography.InlineCode>--radius-xl</Typography.InlineCode>, and the base spacing
                unit <Typography.InlineCode>--sivir-space-unit</Typography.InlineCode>
            </li>
            <li>
                Control height:
                <Typography.InlineCode>--size-control-sm</Typography.InlineCode>,
                <Typography.InlineCode>--size-control-md</Typography.InlineCode>,
                <Typography.InlineCode>--size-control-lg</Typography.InlineCode>, and button-only
                overrides
                <Typography.InlineCode>--size-button-sm</Typography.InlineCode>,
                <Typography.InlineCode>--size-button-md</Typography.InlineCode>,
                <Typography.InlineCode>--size-button-lg</Typography.InlineCode>
                that fall back to the matching control height
            </li>
            <li>
                Motion:
                <Typography.InlineCode>--motion-duration-hover</Typography.InlineCode>,
                <Typography.InlineCode>--motion-duration-menu</Typography.InlineCode>,
                <Typography.InlineCode>--motion-duration-panel</Typography.InlineCode>,
                <Typography.InlineCode>--motion-duration-sheet</Typography.InlineCode>
            </li>
            <li>
                Elevation:
                <Typography.InlineCode>--elevation-1</Typography.InlineCode>,
                <Typography.InlineCode>--elevation-float</Typography.InlineCode>,
                <Typography.InlineCode>--elevation-control</Typography.InlineCode>,
                <Typography.InlineCode>--elevation-modal</Typography.InlineCode>
            </li>
        </ul>
    </section>

    <section id="built-in-presets" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Built-in presets</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Six presets ship with Sivir: <Typography.InlineCode>default</Typography.InlineCode>,
            <Typography.InlineCode>magic</Typography.InlineCode>,
            <Typography.InlineCode>profitable</Typography.InlineCode>,
            <Typography.InlineCode>raven</Typography.InlineCode>,
            <Typography.InlineCode>clawd</Typography.InlineCode>, and
            <Typography.InlineCode>inspiration</Typography.InlineCode>. Preview them live on the
            <a class="text-foreground underline underline-offset-2" href={resolve("/themes")}
                >themes page</a
            >, where you can copy each preset’s CSS or JSON.
        </Typography.Text>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            With the CLI, install a preset into
            <Typography.InlineCode>theme.css</Typography.InlineCode>:
        </Typography.Text>
        <CodeBlock
            code="bunx --package @sivir-ui/svelte sivir add theme raven"
            lang="shell"
            copy="overlay"
        />
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Import it after <Typography.InlineCode>ui.css</Typography.InlineCode> so it wins:
        </Typography.Text>
        <CodeBlock code={themeImport} lang="css" copy="overlay" />
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            <Typography.InlineCode>sivir list</Typography.InlineCode>
            prints the built-in theme slugs.
            <Typography.InlineCode>sivir add theme</Typography.InlineCode>
            also installs community themes published from the Studio; pass the slug shown on the
            themes page.
        </Typography.Text>
    </section>

    <section id="dark-mode" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Dark mode</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Toggle a <Typography.InlineCode>.dark</Typography.InlineCode> class on
            <Typography.InlineCode>&lt;html&gt;</Typography.InlineCode>. Sivir reads the class but
            does not set it.
        </Typography.Text>
    </section>

    <section id="theme-json" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Theme JSON</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Theme JSON (version 4) stores a theme as data. The Studio, the CLI, and the theme
            registry all read this format. Per-mode surface colors go in
            <Typography.InlineCode>foundation.light</Typography.InlineCode>
            and
            <Typography.InlineCode>foundation.dark</Typography.InlineCode>:
            <Typography.InlineCode>base</Typography.InlineCode>,
            <Typography.InlineCode>border</Typography.InlineCode>,
            <Typography.InlineCode>background</Typography.InlineCode>,
            <Typography.InlineCode>secondary</Typography.InlineCode>,
            <Typography.InlineCode>foreground</Typography.InlineCode>,
            <Typography.InlineCode>foregroundMuted</Typography.InlineCode>,
            <Typography.InlineCode>onPrimary</Typography.InlineCode>, and
            <Typography.InlineCode>buttonForeground</Typography.InlineCode>.
            <Typography.InlineCode>typography</Typography.InlineCode>
            sets
            <Typography.InlineCode>headerSize</Typography.InlineCode>,
            <Typography.InlineCode>headerWeight</Typography.InlineCode>, and
            <Typography.InlineCode>roleWeights</Typography.InlineCode>
            for body, label, button, badge, and description.
            <Typography.InlineCode>tokens.shared</Typography.InlineCode>,
            <Typography.InlineCode>tokens.light</Typography.InlineCode>, and
            <Typography.InlineCode>tokens.dark</Typography.InlineCode>
            override raw variables, such as a per-mode
            <Typography.InlineCode>--color-primary</Typography.InlineCode>.
            <Typography.InlineCode>chrome</Typography.InlineCode>
            holds the flags.
            <Typography.InlineCode>shadows: false</Typography.InlineCode>
            removes every shadow;
            <Typography.InlineCode>surfaceShadows</Typography.InlineCode>,
            <Typography.InlineCode>controlShadows</Typography.InlineCode>, and
            <Typography.InlineCode>dialogShadows</Typography.InlineCode>
            turn off one group.
            <Typography.InlineCode>travelingHighlight: false</Typography.InlineCode>
            keeps the item fill and drops the slide.
            <Typography.InlineCode>fancySwap: false</Typography.InlineCode>
            makes icon and label swaps a plain crossfade.
            <Typography.InlineCode>menuPaneling: false</Typography.InlineCode>
            gives menus a plain 1px border with no inset frame.
            <Typography.InlineCode>surfacePaneling: false</Typography.InlineCode>
            makes modals, sheets, popovers, cards, and code blocks one continuous container.
            <Typography.InlineCode>primaryStroke</Typography.InlineCode>
            adds an inset stroke to primary buttons, and
            <Typography.InlineCode>interactiveCursor</Typography.InlineCode>
            is <Typography.InlineCode>'default'</Typography.InlineCode> or
            <Typography.InlineCode>'pointer'</Typography.InlineCode>. Setting
            <Typography.InlineCode>motion: "none"</Typography.InlineCode>
            disables every animation, including dialogs, menus, and the traveling highlight.
        </Typography.Text>
    </section>

    <section id="class-prop" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">class prop</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Every primitive accepts <Typography.InlineCode>class</Typography.InlineCode>. Use
            Tailwind utilities or your own classes for one-off tweaks.
        </Typography.Text>
        <CodeBlock code={classExample} lang="svelte" copy="overlay" />
    </section>

    <section id="data-ui" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">data-ui selectors</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Components render <Typography.InlineCode>data-ui</Typography.InlineCode> (and often
            <Typography.InlineCode>data-variant</Typography.InlineCode>
            /
            <Typography.InlineCode>data-size</Typography.InlineCode>). Use them to style every
            instance of a component without editing its source.
        </Typography.Text>
        <CodeBlock code={dataUiExample} lang="css" copy="overlay" />
    </section>

    <section id="edit-source" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Edit the source</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            With the CLI path, files live under
            <Typography.InlineCode>src/lib/sivir/components/&lt;name&gt;/</Typography.InlineCode>.
            Edit them to change behavior or markup that tokens and classes cannot reach.
        </Typography.Text>
        <CodeBlock code={sourceExample} lang="shell" copy="overlay" />
    </section>

    <section id="next" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Next</Typography.H2>
        <Typography.Text variant="body" class="m-0">
            <a
                class="text-foreground underline underline-offset-2"
                href={resolve('/docs/components')}
                >Components</a
            >
        </Typography.Text>
    </section>
</div>
