<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Basic from './examples/basic.svelte';
    import BasicSrc from './examples/basic.svelte?raw';
    import DeeplyNested from './examples/deeply-nested.svelte';
    import DeeplyNestedSrc from './examples/deeply-nested.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Nested from './examples/nested.svelte';
    import NestedSrc from './examples/nested.svelte?raw';
    import Compact from './examples/size-compact.svelte';
    import CompactSrc from './examples/size-compact.svelte?raw';
    import Large from './examples/size-large.svelte';
    import LargeSrc from './examples/size-large.svelte?raw';
    import Wide from './examples/size-wide.svelte';
    import WideSrc from './examples/size-wide.svelte?raw';
    import WithSelect from './examples/with-select.svelte';
    import WithSelectSrc from './examples/with-select.svelte?raw';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add modal';
</script>

<svelte:head>
    <title>Sivir · Modal</title>
    <meta
        name="description"
        content="A centered dialog with a title, body, and footer actions. Alert Dialog is built on it."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Modal </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Opens over the page, traps focus, and closes on Escape or an outside click. Modals
                can nest, and Escape closes only the top one.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
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
            Bind <Typography.InlineCode>open</Typography.InlineCode> to control the modal from code.
            <Typography.InlineCode>Modal.Close</Typography.InlineCode>
            and
            <Typography.InlineCode>Modal.Confirm</Typography.InlineCode>
            both close it, and a
            <Typography.InlineCode>Shortcut</Typography.InlineCode>
            inside either one clicks that button when its key is pressed.
        </Typography.Text>
        <CodeBlock
            code={`import * as Modal from '@sivir-ui/svelte/components/modal';\nimport Shortcut from '@sivir-ui/svelte/components/shortcut';\n\nlet open = $state(false);\n\n<Modal.Root bind:open>\n  <Modal.Trigger>Rename project</Modal.Trigger>\n  <Modal.Content>\n    <Modal.Header>\n      <Modal.Title>Rename project</Modal.Title>\n      <Modal.Description>The new name appears in URLs and the sidebar.</Modal.Description>\n    </Modal.Header>\n    <Modal.Footer>\n      <Modal.Close>Cancel <Shortcut shortcut="esc" /></Modal.Close>\n      <Modal.Confirm>Save <Shortcut shortcut="enter" /></Modal.Confirm>\n    </Modal.Footer>\n  </Modal.Content>\n</Modal.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <div id="basic" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Basic </Typography.H3>
            <ComponentPreview code={BasicSrc}>
                <Basic />
            </ComponentPreview>
        </div>

        <div id="nested" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Nested </Typography.H3>
            <ComponentPreview code={NestedSrc}>
                <Nested />
            </ComponentPreview>
        </div>

        <div id="deeply-nested" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Deeply nested </Typography.H3>
            <Typography.Text variant="supporting">
                Modals stack to any depth. Each earlier panel recedes behind the next, and Escape
                closes one level at a time.
            </Typography.Text>
            <ComponentPreview code={DeeplyNestedSrc}>
                <DeeplyNested />
            </ComponentPreview>
        </div>

        <div id="with-select" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With select </Typography.H3>
            <Typography.Text variant="supporting">
                Escape closes an open Select first. Press it again to close the modal.
            </Typography.Text>
            <ComponentPreview code={WithSelectSrc}>
                <WithSelect />
            </ComponentPreview>
        </div>

        <div id="size-compact" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Compact </Typography.H3>
            <ComponentPreview code={CompactSrc}>
                <Compact />
            </ComponentPreview>
        </div>

        <div id="size-large" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Large </Typography.H3>
            <ComponentPreview code={LargeSrc}>
                <Large />
            </ComponentPreview>
        </div>

        <div id="size-wide" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Wide </Typography.H3>
            <ComponentPreview code={WideSrc}>
                <Wide />
            </ComponentPreview>
        </div>
    </section>
</div>
