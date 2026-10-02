<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add reorder-list';
</script>

<svelte:head>
    <title>Sivir · Reorder List</title>
    <meta
        name="description"
        content="A list of rows you reorder by dragging or with Space and the arrow keys."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Reorder List </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Rows trade places as you drag, so the list shows the new order before you drop. With
                the keyboard, Space or Enter grabs a row, Up and Down move it, and Escape restores
                the original order.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Bind <Typography.InlineCode>items</Typography.InlineCode>. It updates, and
            <Typography.InlineCode>onReorder</Typography.InlineCode>
            fires, each time a row passes a neighbor. Save from
            <Typography.InlineCode>onCommit</Typography.InlineCode>, which fires once on drop. Row
            content is hidden from screen readers, so
            <Typography.InlineCode>getLabel</Typography.InlineCode>
            supplies the text announced for each row. Rows can be dragged from anywhere with a
            mouse, pen, or touch.
        </Typography.Text>
        <CodeBlock
            lang="svelte"
            copy="overlay"
            code={`import { ReorderList } from '@sivir-ui/svelte/components/reorder-list';

let steps = $state([
  { id: 'build', name: 'Build' },
  { id: 'test', name: 'Test' },
  { id: 'deploy', name: 'Deploy' }
]);

<ReorderList bind:items={steps} getId={(item) => item.id} getLabel={(item) => item.name} label="Pipeline steps" onCommit={saveOrder}>
  {#snippet children(item)}
    <span>{item.name}</span>
  {/snippet}
</ReorderList>`}
        />
    </section>
</div>
