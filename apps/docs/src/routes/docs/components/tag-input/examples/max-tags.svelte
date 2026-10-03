<script lang="ts">
    import * as TagInput from '@sivir-ui/svelte/components/tag-input';

    let tags = $state(['svelte', 'sivir', 'ui', 'forms']);
    let error = $state('');
</script>

<div class="w-full max-w-md">
    <TagInput.Root
        bind:tags
        {error}
        max={5}
        label="Labels"
        description="Up to 5 labels."
        onAdd={() => {
            error = '';
        }}
        onRemove={() => {
            error = '';
        }}
        onReject={(rejection) => {
            error = rejection.reason;
        }}
    >
        <TagInput.List />
        <TagInput.Input placeholder="Add a label…" />
    </TagInput.Root>
</div>
