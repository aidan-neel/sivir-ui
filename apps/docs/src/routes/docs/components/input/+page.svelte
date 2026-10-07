<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewMorph,
        PreviewOptions,
        PropGroup,
        PropSwitch
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Adornments from './examples/adornments.svelte';
    import AdornmentsSrc from './examples/adornments.svelte?raw';
    import Validation from './examples/validation.svelte';
    import ValidationSrc from './examples/validation.svelte?raw';
    import {
        changedInputProps,
        type InputSettings,
        type InputVariant,
        inputCode,
        inputDefaults
    } from './playground/playground';
    import Preview from './playground/preview.svelte';

    const installCommand = 'bunx @sivir-ui/svelte add input';

    const variantOptions: {
        value: InputVariant;
        label: string;
    }[] = [
        {
            value: 'outline',
            label: 'Outline'
        },
        {
            value: 'secondary',
            label: 'Secondary'
        }
    ];

    let settings = $state<InputSettings>({
        ...inputDefaults
    });
    let email = $state('');

    const heroCode = $derived(inputCode(settings));
    const changed = $derived(changedInputProps(settings));
    const morphKey = $derived([settings.label, settings.description, settings.leading].join('-'));
</script>

{#snippet variantControl()}
    <PreviewOptions label="Variant" options={variantOptions} bind:value={settings.variant} />
{/snippet}

{#snippet inputProps()}
    <PropGroup title="Content">
        <PropSwitch label="Label" bind:checked={settings.label} />
        <PropSwitch label="Description" bind:checked={settings.description} />
        <PropSwitch label="Leading icon" bind:checked={settings.leading} />
    </PropGroup>
    <PropGroup title="State">
        <PropSwitch label="Disabled" bind:checked={settings.disabled} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · Input</title>
    <meta
        name="description"
        content="A single-line text field with an optional label, description, and leading or trailing adornments."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Input </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Wraps a native input and forwards its attributes, so type, required, pattern, and
                autocomplete work as usual. Choose the outline or secondary variant.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} controls={variantControl} props={inputProps} {changed}>
            <PreviewMorph key={morphKey}>
                <Preview {settings} bind:value={email} />
            </PreviewMorph>
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Bind <Typography.InlineCode>value</Typography.InlineCode> to read the text. Setting
            <Typography.InlineCode>label</Typography.InlineCode>
            wraps the field in a
            <Typography.InlineCode>&lt;label&gt;</Typography.InlineCode>, so you don't need a
            separate one.
        </Typography.Text>
        <CodeBlock
            code={`import { Input } from '@sivir-ui/svelte/components/input';\n\nlet email = $state('');\n\n<Input bind:value={email} type="email" label="Email" placeholder="you@example.com" />`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Example Descriptions ──────────────────────────────────── -->
    {#snippet adornmentsDescription()}
        <Typography.Text variant="supporting">
            The <Typography.InlineCode>leading</Typography.InlineCode> and
            <Typography.InlineCode>trailing</Typography.InlineCode>
            snippets render inside the field border and ignore pointer events. Use them for icons,
            units, or a fixed suffix. They are ignored for checkbox, file, range, and other non-text
            types.
        </Typography.Text>
    {/snippet}

    {#snippet validationDescription()}
        <Typography.Text variant="supporting">
            Input has no error prop. This example sets native constraints, reads validity through
            <Typography.InlineCode>bind:element</Typography.InlineCode>, and shows messages after
            blur or submit.
        </Typography.Text>
    {/snippet}

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="adornments" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Adornments </Typography.H3>
            <ComponentPreview code={AdornmentsSrc}>
                <Adornments />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render adornmentsDescription()}
            </div>
        </div>

        <div id="validation" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Validation </Typography.H3>
            <ComponentPreview code={ValidationSrc}>
                <Validation />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render validationDescription()}
            </div>
        </div>
    </section>
</div>
