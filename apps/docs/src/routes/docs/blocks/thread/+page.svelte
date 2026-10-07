<script lang="ts">
    import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { resolve } from '$app/paths';
    import Thread from './block/thread.svelte';

    const builtWith = [
        {
            slug: 'message',
            title: 'Message',
            role: 'The question and the answer turn.'
        },
        {
            slug: 'reasoning',
            title: 'Reasoning',
            role: 'The live label, the elapsed time, and the step trail.'
        },
        {
            slug: 'source',
            title: 'Source',
            role: 'The pages the search step read, and the inline chips with their reference cards.'
        },
        {
            slug: 'response-stream',
            title: 'Response Stream',
            role: 'The paced reveal of each thought and the answer.'
        }
    ] as const;

    let run = $state(0);
</script>

<svelte:head>
    <title>Sivir · Thread</title>
    <meta
        name="description"
        content="A question, a live reasoning trace that searches and reads sources, and a streamed answer with inline citations."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>Thread</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A question, a live reasoning trace that searches and reads sources, and a streamed
                answer with inline citations.
            </Typography.Text>
        </div>
        <Button
            variant="outline"
            size="sm"
            class="shrink-0"
            onclick={() => {
                run += 1;
            }}
        >
            <RotateCcw aria-hidden="true" />
            Replay
        </Button>
    </header>

    <section
        aria-label="Thread demo"
        class="flex min-h-[44rem] justify-center rounded-[var(--radius-xl)] border border-border bg-panel px-4 py-8 sm:px-8 sm:py-10"
    >
        <div class="w-full max-w-[40rem]">
            {#key run}
                <Thread />
            {/key}
        </div>
    </section>

    <section id="built-with" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Built with</Typography.H2>
        <ul class="m-0 flex list-none flex-col gap-3 p-0">
            {#each builtWith as item (item.slug)}
                <li class="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                    <a
                        href={resolve(`/docs/components/${item.slug}`)}
                        class="w-40 shrink-0 text-sm font-label text-foreground underline-offset-4 hover:underline"
                    >
                        {item.title}
                    </a>
                    <Typography.Text variant="supporting">{item.role}</Typography.Text>
                </li>
            {/each}
        </ul>
    </section>
</div>
