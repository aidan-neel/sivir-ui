<script lang="ts">
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { resolve } from '$app/paths';
    import { blocks } from '$lib/blocks';
</script>

<svelte:head>
    <title>Sivir · Blocks</title>
    <meta
        name="description"
        content="Complete interface patterns composed from Sivir components."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header>
        <Typography.H1>Blocks</Typography.H1>
        <Typography.Text variant="lead" class="mt-2 max-w-2xl">
            Complete interface patterns composed from Sivir components. Each block runs live, so you
            can watch every state it moves through.
        </Typography.Text>
    </header>

    <ul class="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
        {#each blocks as block (block.slug)}
            <li>
                <a
                    href={resolve(`/docs/blocks/${block.slug}`)}
                    class="flex h-full flex-col gap-1 rounded-[var(--radius-lg)] border border-border bg-card p-4 no-underline transition-colors [transition-duration:var(--motion-duration-hover)] hover:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
                >
                    <span class="text-sm font-label text-foreground">{block.title}</span>
                    <span class="text-sm leading-body text-foreground-muted">
                        {block.description}
                    </span>
                </a>
            </li>
        {/each}
    </ul>
</div>
