<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { invalidateAll } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import { componentSummaries } from '$lib/component-summaries';
    import { components, sanitizeComponent } from '$lib/components';

    type Suggestion = {
        slug: (typeof components)[number];
        distance: number;
    };

    const MAX_SUGGESTIONS = 3;

    const isNotFound = $derived(page.status === 404);
    const requestedSegment = $derived(normalizeSegment(page.url.pathname));
    const suggestions = $derived(isNotFound ? findSuggestions(requestedSegment) : []);

    let retrying = $state(false);

    function normalizeSegment(pathname: string) {
        const segments = pathname.split('/').filter(Boolean);
        const lastSegment = segments.at(-1) ?? '';

        return safeDecode(lastSegment)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function safeDecode(segment: string) {
        try {
            return decodeURIComponent(segment);
        } catch {
            return segment;
        }
    }

    function editDistance(source: string, target: string) {
        let previousRow = Array.from(
            {
                length: target.length + 1
            },
            (_, index) => index
        );

        for (let sourceIndex = 1; sourceIndex <= source.length; sourceIndex += 1) {
            const currentRow = [sourceIndex];

            for (let targetIndex = 1; targetIndex <= target.length; targetIndex += 1) {
                const substitutionCost =
                    source[sourceIndex - 1] === target[targetIndex - 1] ? 0 : 1;

                currentRow[targetIndex] = Math.min(
                    previousRow[targetIndex] + 1,
                    currentRow[targetIndex - 1] + 1,
                    previousRow[targetIndex - 1] + substitutionCost
                );
            }

            previousRow = currentRow;
        }

        return previousRow[target.length];
    }

    function findSuggestions(segment: string) {
        if (segment.length < 3 || segment === 'docs' || segment === 'components') {
            return [];
        }

        const tolerance = Math.max(1, Math.floor(segment.length / 3));
        const matches: Suggestion[] = [];

        for (const slug of components) {
            const contains = slug.includes(segment) || segment.includes(slug);
            const distance = contains ? 0 : editDistance(segment, slug);

            if (distance <= tolerance) {
                matches.push({
                    slug,
                    distance
                });
            }
        }

        return matches
            .sort((first, second) => first.distance - second.distance)
            .slice(0, MAX_SUGGESTIONS);
    }

    function componentHref(slug: Suggestion['slug']) {
        return resolve(`/docs/components/${slug}` as '/docs/components/accordion');
    }

    async function retry() {
        retrying = true;

        try {
            await invalidateAll();
        } finally {
            retrying = false;
        }
    }
</script>

<svelte:head>
    <title>{page.status} · Sivir UI</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<section
    data-docs-page
    class="mx-auto flex w-full max-w-[960px] flex-col gap-10 px-3 pt-16 pb-32 sm:px-8 lg:px-10 lg:pt-24"
>
    <header class="flex max-w-2xl flex-col gap-6">
        <div class="flex flex-col gap-2">
            <Typography.H1 class="m-0">
                {isNotFound ? 'Page not found' : 'Something went wrong'}
            </Typography.H1>
            <Typography.Text variant="lead" class="m-0">
                {#if isNotFound}
                    Nothing is published at
                    <Typography.InlineCode>{page.url.pathname}</Typography.InlineCode>. It may have
                    moved, or the address may have a typo.
                {:else}
                    The server returned a {page.status} error while loading
                    <Typography.InlineCode>{page.url.pathname}</Typography.InlineCode>. Try again,
                    or go back to the docs.
                {/if}
            </Typography.Text>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row">
            {#if isNotFound}
                <Button href={resolve('/docs/introduction')} size="lg" class="justify-center">
                    Back to docs
                </Button>
                <Button
                    href={resolve('/docs/components')}
                    variant="outline"
                    size="lg"
                    class="justify-center"
                >
                    Browse components
                </Button>
            {:else}
                <Button
                    size="lg"
                    loading={retrying}
                    loadingLabel="Retrying"
                    class="justify-center"
                    onclick={retry}
                >
                    Try again
                </Button>
                <Button
                    href={resolve('/docs/introduction')}
                    variant="outline"
                    size="lg"
                    class="justify-center"
                >
                    Back to docs
                </Button>
            {/if}
        </div>
    </header>

    {#if suggestions.length > 0}
        <nav aria-labelledby="error-suggestions" class="flex max-w-2xl flex-col gap-3">
            <h2 id="error-suggestions" class="m-0 text-base font-label text-foreground">
                Did you mean
            </h2>
            <ul class="m-0 flex list-none flex-col p-0 sm:-mx-3">
                {#each suggestions as suggestion (suggestion.slug)}
                    <li>
                        <a
                            href={componentHref(suggestion.slug)}
                            class="grid gap-0.5 rounded-[var(--radius-lg)] py-2.5 no-underline sm:px-3 transition-colors hover:bg-secondary focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none sm:grid-cols-[10rem_1fr] sm:gap-6"
                        >
                            <span class="text-base font-label text-foreground">
                                {sanitizeComponent(suggestion.slug)}
                            </span>
                            <span class="text-base text-pretty text-foreground-muted">
                                {componentSummaries[suggestion.slug]}
                            </span>
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    {/if}
</section>
