<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import type { ModalOrientation, ModalSize } from '@sivir-ui/svelte/components/modal';
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
    import Destructive from './examples/destructive.svelte';
    import DestructiveSrc from './examples/destructive.svelte?raw';
    import Hero from './examples/hero.svelte';
    import SignOut from './examples/sign-out.svelte';
    import SignOutSrc from './examples/sign-out.svelte?raw';
    import {
        type AlertDialogSettings,
        alertDialogCode,
        alertDialogDefaults,
        changedAlertDialogProps
    } from './playground/playground';

    const installCommand = 'bunx @sivir-ui/svelte add alert-dialog';

    const sizeOptions: {
        value: ModalSize;
        label: string;
    }[] = [
        {
            value: 'sm',
            label: 'Small'
        },
        {
            value: 'md',
            label: 'Medium'
        },
        {
            value: 'lg',
            label: 'Large'
        },
        {
            value: 'xl',
            label: 'XL'
        }
    ];

    const orientationOptions: {
        value: ModalOrientation;
        label: string;
    }[] = [
        {
            value: 'vertical',
            label: 'Vertical'
        },
        {
            value: 'horizontal',
            label: 'Horizontal'
        }
    ];

    let settings = $state<AlertDialogSettings>({
        ...alertDialogDefaults
    });

    const heroCode = $derived(alertDialogCode(settings));
    const changed = $derived(changedAlertDialogProps(settings));
</script>

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
        <PropRow label="Orientation">
            <PropSegmented
                label="Orientation"
                size="sm"
                options={orientationOptions}
                bind:value={settings.orientation}
            />
        </PropRow>
        <PropSwitch label="Error" bind:checked={settings.error} />
    </PropGroup>
    <PropGroup title="Behavior">
        <PropSwitch label="Allow Escape" bind:checked={settings.allowEscape} />
    </PropGroup>
{/snippet}

<svelte:head>
    <title>Sivir · Alert Dialog</title>
    <meta
        name="description"
        content="A modal that interrupts the user to confirm a consequential action."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Alert Dialog </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Asks the user to confirm or cancel before a destructive or irreversible action.
                Clicking outside does not close it.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={heroCode} props={heroProps} {changed}>
            <Hero
                error={settings.error}
                orientation={settings.orientation}
                size={settings.size}
                allowEscape={settings.allowEscape}
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
            Set <Typography.InlineCode>error</Typography.InlineCode> on
            <Typography.InlineCode>AlertDialog.Root</Typography.InlineCode>
            to give
            <Typography.InlineCode>AlertDialog.Confirm</Typography.InlineCode>
            the destructive style and turn supported browser chrome red while the dialog is open.
        </Typography.Text>
        <CodeBlock
            code={`import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';\nimport Shortcut from '@sivir-ui/svelte/components/shortcut';\n\n<AlertDialog.Root error>\n  <AlertDialog.Trigger>Delete project</AlertDialog.Trigger>\n  <AlertDialog.Content>\n    <AlertDialog.Header>\n      <AlertDialog.Title>Delete project?</AlertDialog.Title>\n      <AlertDialog.Description>Its deployments and history will be removed. This cannot be undone.</AlertDialog.Description>\n    </AlertDialog.Header>\n    <AlertDialog.Footer>\n      <AlertDialog.Exit>Cancel <Shortcut shortcut="esc" /></AlertDialog.Exit>\n      <AlertDialog.Confirm>Delete <Shortcut shortcut="enter" /></AlertDialog.Confirm>\n    </AlertDialog.Footer>\n  </AlertDialog.Content>\n</AlertDialog.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="destructive" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">
                Destructive confirmation
            </Typography.H3>
            <ComponentPreview code={DestructiveSrc}>
                <Destructive />
            </ComponentPreview>
        </div>

        <div id="sign-out" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Sign out confirmation </Typography.H3>
            <ComponentPreview code={SignOutSrc}>
                <SignOut />
            </ComponentPreview>
        </div>
    </section>
</div>
