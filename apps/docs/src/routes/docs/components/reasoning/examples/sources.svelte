<script lang="ts">
    import Globe from '@lucide/svelte/icons/globe';
    import Lightbulb from '@lucide/svelte/icons/lightbulb';
    import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
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

<Reasoning.Root duration={8} open class="w-full max-w-xl">
    <Reasoning.Trigger />
    <Reasoning.Content>
        <Reasoning.Steps>
            <Reasoning.Step title="Searched 3 websites" collapsible>
                {#snippet icon()}
                    <Globe />
                {/snippet}
                <div class="flex flex-wrap gap-1.5 pt-0.5">
                    {#each sources as source (source.href)}
                        <Source.Root href={source.href}>
                            <Source.Icon src={source.icon} fallback={source.domain} />
                            <Source.Label>{source.domain}</Source.Label>
                        </Source.Root>
                    {/each}
                </div>
            </Reasoning.Step>
            <Reasoning.Step title="Checking response-time limits">
                {#snippet icon()}
                    <Lightbulb />
                {/snippet}
                <p class="m-0 text-foreground-muted">
                    People notice a delay after about a second, so several seconds of reasoning
                    needs feedback that changes.
                </p>
            </Reasoning.Step>
        </Reasoning.Steps>
    </Reasoning.Content>
</Reasoning.Root>
