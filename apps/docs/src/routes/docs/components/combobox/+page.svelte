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
    import InputSearch from './examples/input-search.svelte';
    import InputSearchSrc from './examples/input-search.svelte?raw';
    import MenuSearch from './examples/menu-search.svelte';
    import MenuSearchSrc from './examples/menu-search.svelte?raw';
    import Scrollable from './examples/scrollable.svelte';
    import ScrollableSrc from './examples/scrollable.svelte?raw';
    import {
        type ComboboxAppearance,
        type ComboboxSearchPlacement,
        type ComboboxSettings,
        type ComboboxSize,
        type ComboboxVariant,
        changedComboboxProps,
        comboboxCode,
        comboboxDefaults
    } from './playground/playground';

    type Option<T extends string> = {
        value: T;
        label: string;
    };

    const TITLE = 'Combobox';
    const SLUG = 'combobox';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;

    const variantOptions: Option<ComboboxVariant>[] = [
        {
            value: 'outline',
            label: 'Outline'
        },
        {
            value: 'secondary',
            label: 'Secondary'
        }
    ];

    const sizeOptions: Option<ComboboxSize>[] = [
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

    const appearanceOptions: Option<ComboboxAppearance>[] = [
        {
            value: 'button',
            label: 'Button'
        },
        {
            value: 'input',
            label: 'Input'
        }
    ];

    const searchOptions: Option<ComboboxSearchPlacement>[] = [
        {
            value: 'trigger',
            label: 'Trigger'
        },
        {
            value: 'menu',
            label: 'Menu'
        }
    ];

    let settings = $state<ComboboxSettings>({
        ...comboboxDefaults
    });

    const heroCode = $derived(comboboxCode(settings));
    const changed = $derived(changedComboboxProps(settings));
    const morphKey = $derived(
        [
            settings.variant,
            settings.size,
            settings.appearance,
            settings.searchPlacement,
            settings.disabled
        ].join('-')
    );
</script>

{#snippet heroControls()}
    <PreviewOptions label="Variant" options={variantOptions} bind:value={settings.variant} />
{/snippet}

{#snippet heroProps()}
    <PropGroup title="Appearance">
        <PropRow label="Trigger">
            <PropSegmented
                label="Trigger"
                options={appearanceOptions}
                bind:value={settings.appearance}
            />
        </PropRow>
        <PropRow label="Size">
            <PropSegmented label="Size" options={sizeOptions} bind:value={settings.size} />
        </PropRow>
    </PropGroup>
    <PropGroup title="Behavior">
        <PropRow label="Search in">
            <PropSegmented
                label="Search in"
                options={searchOptions}
                bind:value={settings.searchPlacement}
            />
        </PropRow>
        <PropSwitch label="Disabled" bind:checked={settings.disabled} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A select with a text field that fuzzy-filters its options as you type."
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
                Matching uses fuse.js against each item's value and label, so small typos still
                match. Lower the trigger's threshold (default 0.28) to make matching stricter.
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
                    appearance={settings.appearance}
                    searchPlacement={settings.searchPlacement}
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
            Bind <Typography.InlineCode>value</Typography.InlineCode> on
            <Typography.InlineCode>Combobox.Root</Typography.InlineCode>. Every item needs a
            <Typography.InlineCode>value</Typography.InlineCode>
            and a
            <Typography.InlineCode>label</Typography.InlineCode>. The trigger is a text field that
            shows the selected label, so it takes a
            <Typography.InlineCode>placeholder</Typography.InlineCode>
            instead of children.
        </Typography.Text>
        <CodeBlock
            code={`import * as Combobox from '@sivir-ui/svelte/components/combobox';\n\nlet framework = $state('');\n\n<Combobox.Root bind:value={framework}>\n  <Combobox.Trigger placeholder="Choose a framework" />\n  <Combobox.Content>\n    <Combobox.Results>\n      <Combobox.Item value="sveltekit" label="SvelteKit" />\n      <Combobox.Item value="astro" label="Astro" />\n    </Combobox.Results>\n  </Combobox.Content>\n</Combobox.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Example Descriptions ──────────────────────────────────── -->
    {#snippet inputSearchDescription()}
        <Typography.Text variant="supporting">
            Set <Typography.InlineCode>appearance="input"</Typography.InlineCode> to style the
            trigger as an input. It opens on focus or typing, and shows a clear button once it has a
            query or selection. It has no chevron; pass a
            <Typography.InlineCode>trailing</Typography.InlineCode>
            snippet to show an icon while the field is empty.
        </Typography.Text>
    {/snippet}

    {#snippet menuSearchDescription()}
        <Typography.Text variant="supporting">
            Set <Typography.InlineCode>searchPlacement="menu"</Typography.InlineCode> on the trigger
            to make it read-only and put the search field at the top of the menu.
        </Typography.Text>
    {/snippet}

    {#snippet scrollableDescription()}
        <Typography.Text variant="supporting">
            Add a <Typography.InlineCode>max-h-*</Typography.InlineCode> class to
            <Typography.InlineCode>Combobox.Content</Typography.InlineCode>
            to cap the menu height. Longer result lists scroll inside it.
        </Typography.Text>
    {/snippet}

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="basic" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Basic usage </Typography.H3>
            <ComponentPreview code={BasicSrc}>
                <Basic />
            </ComponentPreview>
        </div>

        <div id="input-search" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Input search </Typography.H3>
            <ComponentPreview code={InputSearchSrc}>
                <InputSearch />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render inputSearchDescription()}
            </div>
        </div>

        <div id="menu-search" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Search in the menu </Typography.H3>
            <ComponentPreview code={MenuSearchSrc}>
                <MenuSearch />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render menuSearchDescription()}
            </div>
        </div>

        <div id="scrollable" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Scrollable </Typography.H3>
            <ComponentPreview code={ScrollableSrc}>
                <Scrollable />
            </ComponentPreview>
            <div class="flex max-w-2xl flex-col gap-2">
                {@render scrollableDescription()}
            </div>
        </div>
    </section>
</div>
