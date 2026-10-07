<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewMorph,
        PreviewOptions,
        PropGroup,
        PropRow,
        PropSegmented,
        PropSwitch
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Basic from './examples/basic.svelte';
    import BasicSrc from './examples/basic.svelte?raw';
    import Hero from './examples/hero.svelte';
    import Variants from './examples/variants.svelte';
    import VariantsSrc from './examples/variants.svelte?raw';
    import {
        type CopyButtonSettings,
        type CopyButtonSize,
        type CopyButtonVariant,
        changedCopyButtonProps,
        copyButtonCode,
        copyButtonDefaults
    } from './playground/playground';

    type Option<T extends string> = {
        value: T;
        label: string;
    };

    const _TITLE = 'Copy Button';

    const installCommand = 'bunx @sivir-ui/svelte add copy-button';

    const variantOptions: Option<CopyButtonVariant>[] = [
        {
            value: 'ghost',
            label: 'Ghost'
        },
        {
            value: 'outline',
            label: 'Outline'
        },
        {
            value: 'secondary',
            label: 'Secondary'
        }
    ];

    const sizeOptions: Option<CopyButtonSize>[] = [
        {
            value: 'icon',
            label: 'Icon'
        },
        {
            value: 'sm',
            label: 'Small'
        },
        {
            value: 'md',
            label: 'Default'
        },
        {
            value: 'lg',
            label: 'Large'
        }
    ];

    let settings = $state<CopyButtonSettings>({
        ...copyButtonDefaults
    });

    const heroCode = $derived(copyButtonCode(settings));
    const changed = $derived(changedCopyButtonProps(settings));
    const morphKey = $derived(`${settings.variant}-${settings.size}`);
</script>

{#snippet heroControls()}
    <PreviewOptions label="Variant" options={variantOptions} bind:value={settings.variant} />
{/snippet}

{#snippet heroProps()}
    <PropGroup title="Appearance">
        <PropRow label="Size">
            <PropSegmented
                label="Size"
                size="sm"
                options={sizeOptions}
                bind:value={settings.size}
            />
        </PropRow>
    </PropGroup>
    <PropGroup title="State">
        <PropSwitch label="Disabled" bind:checked={settings.disabled} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · Copy Button</title>
    <meta
        name="description"
        content="A button that copies a string to the clipboard and confirms with a check icon and tooltip."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Copy Button </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Copies its text on click. The icon turns into a check and the tooltip reads Copied
                for two seconds, then both revert.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} controls={heroControls} props={heroProps} {changed}>
            <PreviewMorph key={morphKey}>
                <Hero
                    variant={settings.variant}
                    size={settings.size}
                    disabled={settings.disabled}
                />
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
            <Typography.InlineCode>text</Typography.InlineCode>
            is required. The button is icon-only by default, so
            <Typography.InlineCode>label</Typography.InlineCode>
            sets both the tooltip and the accessible name. To show a visible label, pass children
            and a text
            <Typography.InlineCode>size</Typography.InlineCode>
            such as
            <Typography.InlineCode>sm</Typography.InlineCode>; the default
            <Typography.InlineCode>icon</Typography.InlineCode>
            size clips text.
        </Typography.Text>
        <CodeBlock
            code={`import { CopyButton } from '@sivir-ui/svelte/components/copy-button';\n\n<CopyButton text="bun add @sivir-ui/svelte" />\n<CopyButton text={apiKey} label="Copy key" variant="outline" />\n<CopyButton text={inviteUrl} size="sm">Copy link</CopyButton>`}
            lang="svelte"
            copy="overlay"
        />
        <Typography.Text variant="supporting">
            The tooltip opens after 125ms. Raise
            <Typography.InlineCode>tooltipDelay</Typography.InlineCode>
            in a row of message actions so tooltips appear only when the pointer rests.
            <Typography.InlineCode>duration</Typography.InlineCode>
            sets how long the copied state holds (2000ms by default), and
            <Typography.InlineCode>oncopy</Typography.InlineCode>
            fires after a successful write.
        </Typography.Text>
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="in-a-field" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> In a field </Typography.H3>
            <ComponentPreview code={BasicSrc}>
                <Basic />
            </ComponentPreview>
        </div>

        <div id="variants" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Variants </Typography.H3>
            <ComponentPreview code={VariantsSrc}>
                <Variants />
            </ComponentPreview>
        </div>
    </section>
</div>
