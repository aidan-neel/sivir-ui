<script lang="ts">
    import * as Source from '@sivir-ui/svelte/components/source';
</script>

<p class="m-0 max-w-xl leading-body text-foreground">
    People notice a delay after about a second and lose focus after ten, so a model that reasons for
    several seconds needs feedback that changes.
    <Source.Root href="https://www.nngroup.com/articles/response-times-3-important-limits/">
        <Source.Icon src="/favicons/nngroup.com.png" fallback="nngroup.com" />
        <Source.Label>Nielsen Norman Group</Source.Label>
        <Source.Content>
            <Source.Item href="https://www.nngroup.com/articles/response-times-3-important-limits/">
                <Source.Icon src="/favicons/nngroup.com.png" fallback="nngroup.com" />
                <Source.Label>nngroup.com</Source.Label>
                <Source.Title>Response Times: The 3 Important Limits</Source.Title>
                <Source.Description>
                    The classic 0.1, 1 and 10 second limits for keeping attention and a sense of
                    control while a system works.
                </Source.Description>
            </Source.Item>
        </Source.Content>
    </Source.Root>
</p>
