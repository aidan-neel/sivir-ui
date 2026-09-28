<script lang="ts">
    import * as Attachment from '@sivir-ui/svelte/components/attachment';

    let files = $state<File[]>([]);
</script>

<Attachment.Root
    bind:files
    accept="image/png,image/jpeg,.pdf"
    maxFiles={3}
    maxSize={5 * 1024 * 1024}
    class="flex w-full max-w-xl flex-col gap-3"
>
    <div
        class="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border-[length:var(--border-size)] border-dashed border-border px-6 py-8 text-center"
    >
        <div class="flex flex-col gap-1">
            <p class="text-sm font-label text-foreground">Drop, paste, or choose files</p>
            <p class="text-xs text-foreground-muted">
                PNG, JPG, or PDF up to 5 MB. Three files at most.
            </p>
        </div>
        <Attachment.Trigger variant="outline">Choose files</Attachment.Trigger>
    </div>
    <Attachment.List class="grid-cols-1" />
</Attachment.Root>
