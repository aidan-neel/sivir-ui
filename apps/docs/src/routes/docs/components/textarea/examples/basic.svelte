<script lang="ts">
    import { Textarea } from '@sivir-ui/svelte/components/textarea';

    let value = $state('');
    let error = $state('');

    function handleChange(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        value = target.value;
        error = value.length > 500 ? 'Keep it under 500 characters.' : '';
    }
</script>

<div class="w-full max-w-sm flex flex-col gap-2">
    <Textarea {error} placeholder="Share your feedback…" onchange={handleChange} {value} />
    <span class="text-xs text-foreground-muted">{value.length} / 500 characters</span>
</div>
