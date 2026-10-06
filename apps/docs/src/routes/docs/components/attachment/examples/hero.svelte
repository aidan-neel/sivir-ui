<script lang="ts">
    import * as Attachment from '@sivir-ui/svelte/components/attachment';

    let {
        multiple = true,
        maxFiles = 3,
        disabled = false,
        addOnPaste = true
    }: {
        multiple?: boolean;
        maxFiles?: number | null;
        disabled?: boolean;
        addOnPaste?: boolean;
    } = $props();

    const COUNTS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five'];

    let files = $state<File[]>([]);

    const sources = $derived(addOnPaste ? 'Drop, paste, or choose' : 'Drop or choose');
    const limit = $derived.by(() => {
        if (!multiple || maxFiles === null) {
            return '';
        }
        const count = COUNTS[maxFiles] ?? String(maxFiles);

        if (maxFiles === 1) {
            return ` ${count} file at most.`;
        }
        return ` ${count} files at most.`;
    });
</script>

<Attachment.Root
    bind:files
    accept="image/png,image/jpeg,.pdf"
    {multiple}
    maxFiles={maxFiles ?? undefined}
    maxSize={5 * 1024 * 1024}
    {addOnPaste}
    {disabled}
    class="flex w-full max-w-xl flex-col gap-3"
>
    <div
        class="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border-[length:var(--border-size)] border-dashed border-border px-6 py-8 text-center"
    >
        <div class="flex flex-col gap-1">
            <p class="text-sm font-label text-foreground">
                {sources}
                {multiple ? 'files' : 'a file'}
            </p>
            <p class="text-xs text-foreground-muted">PNG, JPG, or PDF up to 5 MB.{limit}</p>
        </div>
        <Attachment.Trigger variant="outline">
            {multiple ? 'Choose files' : 'Choose a file'}
        </Attachment.Trigger>
    </div>
    <Attachment.List class="grid-cols-1" />
</Attachment.Root>
