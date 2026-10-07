<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import {
        ComponentPreview,
        InstallCommand,
        PreviewExamples,
        PreviewOptions,
        PropGroup,
        PropRow,
        PropSwitch
    } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import AllTypes from './examples/all-types.svelte';
    import AllTypesSrc from './examples/all-types.svelte?raw';
    import Hero from './examples/hero.svelte';
    import {
        changedToastProps,
        type ToastPlaygroundDuration,
        type ToastPlaygroundType,
        type ToastSettings,
        toastCode,
        toastDefaults
    } from './playground/playground';

    const installCommand = 'bunx @sivir-ui/svelte add toast';

    const typeOptions: {
        value: ToastPlaygroundType;
        label: string;
    }[] = [
        {
            value: 'default',
            label: 'Default'
        },
        {
            value: 'success',
            label: 'Success'
        },
        {
            value: 'info',
            label: 'Info'
        },
        {
            value: 'warning',
            label: 'Warning'
        },
        {
            value: 'error',
            label: 'Error'
        }
    ];

    const durationOptions: {
        value: ToastPlaygroundDuration;
        label: string;
    }[] = [
        {
            value: '2000',
            label: '2s'
        },
        {
            value: '5600',
            label: '5.6s'
        },
        {
            value: '10000',
            label: '10s'
        },
        {
            value: 'persistent',
            label: 'Never'
        }
    ];

    let settings = $state<ToastSettings>({
        ...toastDefaults
    });

    const heroCode = $derived(toastCode(settings));
    const changed = $derived(changedToastProps(settings));
</script>

{#snippet heroControls()}
    <PreviewOptions label="Type" options={typeOptions} bind:value={settings.type} />
{/snippet}

{#snippet heroProps()}
    <PropGroup title="Content">
        <PropSwitch label="Description" bind:checked={settings.description} />
        <PropSwitch label="Action" bind:checked={settings.action} />
    </PropGroup>
    <PropGroup title="Behavior">
        <PropRow label="Duration">
            <PreviewExamples
                label="Duration"
                size="sm"
                options={durationOptions}
                bind:value={settings.duration}
            />
        </PropRow>
        <PropSwitch label="Close button" bind:checked={settings.closeButton} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · Toast</title>
    <meta
        name="description"
        content="Short notifications that you trigger from code and that close on a timer."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Toast </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Call <Typography.InlineCode>toast()</Typography.InlineCode> from any component.
                Toasts stack at the bottom of the screen, pause while hovered, and can carry action
                buttons.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} controls={heroControls} props={heroProps} {changed}>
            <Hero
                type={settings.type}
                description={settings.description}
                action={settings.action}
                duration={settings.duration}
                closeButton={settings.closeButton}
            />
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Mount <Typography.InlineCode>{'<Toaster />'}</Typography.InlineCode> once in your root
            layout; <Typography.InlineCode>toast()</Typography.InlineCode> does nothing until one is
            mounted. Toasts close after 5.6 seconds unless you pass
            <Typography.InlineCode>duration</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock
            code={`import { Button } from '@sivir-ui/svelte/components/button';\nimport { toast, Toaster } from '@sivir-ui/svelte/components/toast';\n\n<!-- Mount once, usually in your root layout -->\n<Toaster />\n\n<Button\n  onclick={() =>\n    toast.success('Saved to drafts', {\n      description: 'Publish it from the Drafts tab.'\n    })}\n>\n  Save\n</Button>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="types" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> All types </Typography.H3>
            <ComponentPreview code={AllTypesSrc}>
                <AllTypes />
            </ComponentPreview>
        </div>
    </section>
</div>
