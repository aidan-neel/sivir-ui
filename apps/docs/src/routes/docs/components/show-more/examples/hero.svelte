<script lang="ts">
    import { ShowMore } from '@sivir-ui/svelte/components/show-more';
    import { incidentParagraphs } from '../playground/playground';

    let {
        lines = 2,
        maxHeight = 320,
        defaultExpanded = false
    }: {
        lines?: number;
        maxHeight?: number;
        defaultExpanded?: boolean;
    } = $props();
</script>

<div class="w-full max-w-md">
    <ShowMore {lines} {maxHeight} {defaultExpanded} label="Incident summary">
        <div class="flex flex-col gap-2">
            {#each incidentParagraphs as paragraph (paragraph)}
                <p>{paragraph}</p>
            {/each}
        </div>
    </ShowMore>
</div>
