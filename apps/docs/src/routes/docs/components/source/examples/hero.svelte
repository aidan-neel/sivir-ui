<script lang="ts">
    import * as Source from '@sivir-ui/svelte/components/source';

    const sources = [
        {
            domain: 'nngroup.com',
            href: 'https://www.nngroup.com/articles/response-times-3-important-limits/',
            icon: '/favicons/nngroup.com.png'
        },
        {
            domain: 'developer.mozilla.org',
            href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame',
            icon: '/favicons/developer.mozilla.org.png'
        },
        {
            domain: 'web.dev',
            href: 'https://web.dev/articles/optimize-inp',
            icon: '/favicons/web.dev.png'
        }
    ];
</script>

<div class="flex max-w-xl flex-wrap gap-1.5">
    {#each sources as source (source.href)}
        <Source.Root href={source.href}>
            <Source.Icon src={source.icon} fallback={source.domain} />
            <Source.Label>{source.domain}</Source.Label>
        </Source.Root>
    {/each}
</div>
