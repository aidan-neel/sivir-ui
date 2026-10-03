<script lang="ts">
    import * as TagInput from '@sivir-ui/svelte/components/tag-input';

    let tags = $state(['svelte', 'design-system', 'tailwind']);
</script>

<div class="w-full max-w-md">
    <TagInput.Root bind:tags label="Topics" description="Type a topic and press Enter.">
        <TagInput.List />
        <TagInput.Input placeholder="Add a topic…" />
    </TagInput.Root>
</div>
