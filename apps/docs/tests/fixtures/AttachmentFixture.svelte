<script lang="ts">
    import type { AttachmentRejection } from '@sivir-ui/svelte/components/attachment';
    import * as Attachment from '@sivir-ui/svelte/components/attachment';

    let {
        accept = '.txt',
        maxFiles = 2,
        maxSize = 1024,
        addOnPaste = true,
        composed = false
    }: {
        accept?: string;
        maxFiles?: number;
        maxSize?: number;
        addOnPaste?: boolean;
        composed?: boolean;
    } = $props();

    let files = $state<File[]>([]);
    let rejections = $state<AttachmentRejection[]>([]);
</script>

<Attachment.Root
    bind:files
    {accept}
    {maxFiles}
    {maxSize}
    {addOnPaste}
    onReject={(next) => (rejections = next)}
>
    <Attachment.Trigger>Choose files</Attachment.Trigger>
    <textarea aria-label="Prompt"></textarea>
    {#if composed}
        <Attachment.List>
            {#snippet children(file)}
                <Attachment.Item {file} status="uploading" progress={40}>
                    <Attachment.Name />
                    <Attachment.Status />
                </Attachment.Item>
            {/snippet}
        </Attachment.List>
    {:else}
        <Attachment.List />
    {/if}
</Attachment.Root>

<p data-testid="attachment-count">{files.length}</p>
<p data-testid="rejection-codes">
    {rejections.map(({ file, code }) => `${file.name}:${code}`).join('|')}
</p>
