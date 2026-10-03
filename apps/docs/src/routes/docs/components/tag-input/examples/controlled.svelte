<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as TagInput from '@sivir-ui/svelte/components/tag-input';
    import * as Typography from '@sivir-ui/svelte/components/typography';

    let tags = $state(['announcements']);
    let lastChange = $state('No changes yet');
</script>

<div class="flex w-full max-w-md flex-col gap-3">
    <TagInput.Root
        bind:tags
        label="Channels"
        description="Release alerts post to these channels."
        onAdd={(tag) => {
            lastChange = `Added ${tag}`;
        }}
        onRemove={(tag) => {
            lastChange = `Removed ${tag}`;
        }}
    >
        <TagInput.List />
        <TagInput.Input placeholder="Add a channel…" />
    </TagInput.Root>

    <div class="flex items-center justify-between gap-3">
        <Typography.Metadata aria-live="polite">{lastChange}</Typography.Metadata>
        <Button
            variant="ghost"
            size="sm"
            disabled={tags.length === 0}
            onclick={() => {
                tags = [];
                lastChange = 'Cleared all channels';
            }}
        >
            Clear all
        </Button>
    </div>
</div>
