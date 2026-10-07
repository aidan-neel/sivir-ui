<script lang="ts">
    import * as Source from '@sivir-ui/svelte/components/source';

    const sources = [
        {
            domain: 'developer.mozilla.org',
            href: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame',
            icon: '/favicons/developer.mozilla.org.png',
            title: 'Window: requestAnimationFrame() method',
            description:
                'Schedules work right before the next repaint, the standard way to run smooth, frame-synced animation.'
        },
        {
            domain: 'web.dev',
            href: 'https://web.dev/articles/optimize-inp',
            icon: '/favicons/web.dev.png',
            title: 'Optimize Interaction to Next Paint',
            description:
                'Keeping the main thread free so the page answers clicks, taps and typing quickly.'
        }
    ];

    const [first] = sources;
</script>

<p class="m-0 max-w-xl leading-body text-foreground">
    Drive the motion from the browser’s frame loop so the indicator and the text stay smooth without
    blocking input.
    <Source.Root href={first.href} count={sources.length}>
        <Source.Icon src={first.icon} fallback={first.domain} />
        <Source.Label>MDN</Source.Label>
        <Source.Count />
        <Source.Content>
            {#each sources as source (source.href)}
                <Source.Item href={source.href}>
                    <Source.Icon src={source.icon} fallback={source.domain} />
                    <Source.Label>{source.domain}</Source.Label>
                    <Source.Title>{source.title}</Source.Title>
                    <Source.Description>{source.description}</Source.Description>
                </Source.Item>
            {/each}
        </Source.Content>
    </Source.Root>
</p>
