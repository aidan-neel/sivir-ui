<script lang="ts">
    import { Textarea } from '@sivir-ui/svelte/components/textarea';

    let value = $state('');

    const tooLong = $derived(value.length > 500);
</script>

<div class="w-full max-w-sm flex flex-col gap-2">
    <Textarea
        bind:value
        aria-invalid={tooLong || undefined}
        aria-describedby="feedback-count"
        placeholder="Share your feedback…"
    />
    <span id="feedback-count" class={['text-xs', tooLong ? 'text-error' : 'text-foreground-muted']}>
        {tooLong ? 'Keep it under 500 characters.' : `${value.length} / 500 characters`}
    </span>
</div>
