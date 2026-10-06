<script lang="ts">
    import type { ButtonVariant } from '@sivir-ui/svelte/components/button';
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewMorph,
        PreviewOptions,
        PropGroup,
        PropRow,
        PropSegmented
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import IconGroup from './examples/icon-group.svelte';
    import IconGroupSrc from './examples/icon-group.svelte?raw';
    import {
        type PlaygroundExample,
        type PlaygroundSize,
        playgroundCode
    } from './playground/playground';
    import Playground from './playground/playground.svelte';

    const installCommand = 'bunx @sivir-ui/svelte add button';

    const variantOptions: {
        value: ButtonVariant;
        label: string;
    }[] = [
        {
            value: 'primary',
            label: 'Primary'
        },
        {
            value: 'secondary',
            label: 'Secondary'
        },
        {
            value: 'outline',
            label: 'Outline'
        },
        {
            value: 'ghost',
            label: 'Ghost'
        },
        {
            value: 'quiet',
            label: 'Quiet'
        },
        {
            value: 'destructive',
            label: 'Destructive'
        },
        {
            value: 'panel',
            label: 'Panel'
        }
    ];

    const sizeOptions: {
        value: PlaygroundSize;
        label: string;
    }[] = [
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

    let variant = $state<ButtonVariant>('primary');
    let size = $state<PlaygroundSize>('md');

    const heroCode = $derived(
        playgroundCode({
            example: 'default',
            variant,
            size
        })
    );

    const examples: {
        value: PlaygroundExample;
        label: string;
    }[] = [
        {
            value: 'leading',
            label: 'Leading icon'
        },
        {
            value: 'trailing',
            label: 'Trailing icon'
        },
        {
            value: 'status',
            label: 'Status'
        },
        {
            value: 'link',
            label: 'As link'
        },
        {
            value: 'disabled',
            label: 'Disabled'
        }
    ];

    function exampleCode(example: PlaygroundExample) {
        return playgroundCode({
            example,
            variant: 'primary',
            size: 'md'
        });
    }
</script>

{#snippet playgroundControls()}
    <PreviewOptions label="Variant" options={variantOptions} bind:value={variant} />
{/snippet}

{#snippet playgroundProps()}
    <PropGroup title="Appearance">
        <PropRow label="Size">
            <PropSegmented label="Size" options={sizeOptions} bind:value={size} />
        </PropRow>
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · Button</title>
    <meta
        name="description"
        content="Displays an action or link with stable loading, success, and error states."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Button </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Renders a button element, or a link when you pass href. Defaults to the primary
                variant at medium size.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview
            code={heroCode}
            controls={playgroundControls}
            props={playgroundProps}
            changed={size === 'md' ? 0 : 1}
        >
            <PreviewMorph key={`${variant}-${size}`}>
                <Playground example="default" {variant} {size} />
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
            Set <Typography.InlineCode>status</Typography.InlineCode> to
            <Typography.InlineCode>loading</Typography.InlineCode>,
            <Typography.InlineCode>success</Typography.InlineCode>, or
            <Typography.InlineCode>error</Typography.InlineCode>
            for async feedback, then back to
            <Typography.InlineCode>idle</Typography.InlineCode>. The button resizes to fit each
            label and animates between widths, and status labels fade in letter by letter. Clicks
            are ignored while loading. The default labels are Loading…, Done, and Try again.
        </Typography.Text>
        <CodeBlock
            code={`import { Button } from '@sivir-ui/svelte/components/button';

let status: 'idle' | 'loading' | 'success' | 'error' = $state('idle');

<Button {status} loadingLabel="Publishing…" successLabel="Published">
  Publish
</Button>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        {#each examples as item (item.value)}
            <div id={item.value} class="scroll-mt-20 flex flex-col gap-3">
                <Typography.H3 class="docs-subsection-heading"> {item.label} </Typography.H3>
                <ComponentPreview code={exampleCode(item.value)}>
                    <Playground example={item.value} variant="primary" size="md" />
                </ComponentPreview>
            </div>
        {/each}

        <div id="icon-group" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Icon group </Typography.H3>
            <ComponentPreview code={IconGroupSrc}>
                <IconGroup />
            </ComponentPreview>
        </div>
    </section>
</div>
