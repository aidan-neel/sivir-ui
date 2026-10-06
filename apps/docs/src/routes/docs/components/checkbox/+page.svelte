<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewOptions,
        PropGroup,
        PropSwitch
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Checked from './examples/checked.svelte';
    import CheckedSrc from './examples/checked.svelte?raw';
    import Disabled from './examples/disabled.svelte';
    import DisabledSrc from './examples/disabled.svelte?raw';
    import Hero from './examples/hero.svelte';
    import WithDescription from './examples/with-description.svelte';
    import WithDescriptionSrc from './examples/with-description.svelte?raw';

    const TITLE = 'Checkbox';
    const SLUG = 'checkbox';

    import {
        type CheckboxSettings,
        changedCheckboxProps,
        checkboxCode,
        checkboxDefaults,
        checkboxVariants
    } from './playground/playground';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    let settings = $state<CheckboxSettings>({
        ...checkboxDefaults
    });

    const heroCode = $derived(checkboxCode(settings));
    const changed = $derived(changedCheckboxProps(settings));
</script>

{#snippet heroControls()}
    <PreviewOptions label="Variant" options={checkboxVariants} bind:value={settings.variant} />
{/snippet}

{#snippet heroProps()}
    <PropGroup title="State">
        <PropSwitch label="Checked" bind:checked={settings.checked} />
        <PropSwitch label="Disabled" bind:checked={settings.disabled} />
    </PropGroup>
    <PropGroup title="Content">
        <PropSwitch label="Description" bind:checked={settings.description} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A checkbox with a bindable checked state, an optional label, and an optional description."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                The native checkbox sits inside a label, so clicking the text toggles it. The
                primary variant draws a bordered row that tints when checked.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} controls={heroControls} props={heroProps} {changed}>
            <Hero
                variant={settings.variant}
                bind:checked={settings.checked}
                description={settings.description}
                disabled={settings.disabled}
            />
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
            Bind <Typography.InlineCode>checked</Typography.InlineCode>, or pass
            <Typography.InlineCode>onCheckedChange</Typography.InlineCode>
            to react to changes.
            <Typography.InlineCode>description</Typography.InlineCode>
            renders only when <Typography.InlineCode>label</Typography.InlineCode> is set.
        </Typography.Text>
        <CodeBlock
            code={`import { Checkbox } from '@sivir-ui/svelte/components/checkbox';\n\nlet accepted = $state(false);\n\n<Checkbox bind:checked={accepted} label="I agree to the terms of service" />`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="preferences" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">
                Notification preferences
            </Typography.H3>
            <ComponentPreview code={WithDescriptionSrc}>
                <WithDescription />
            </ComponentPreview>
        </div>

        <div id="permissions" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Disabled by policy </Typography.H3>
            <ComponentPreview code={DisabledSrc}>
                <Disabled />
            </ComponentPreview>
        </div>

        <div id="controlled" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Controlled state </Typography.H3>
            <ComponentPreview code={CheckedSrc}>
                <Checked />
            </ComponentPreview>
        </div>
    </section>
</div>
