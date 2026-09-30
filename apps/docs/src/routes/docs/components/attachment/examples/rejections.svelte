<script lang="ts">
    import type { AttachmentRejection } from '@sivir-ui/svelte/components/attachment';
    import * as Attachment from '@sivir-ui/svelte/components/attachment';

    let files = $state<File[]>([]);
    let rejections = $state.raw<AttachmentRejection[]>([]);
</script>

<Attachment.Root
    bind:files
    accept="image/*"
    maxFiles={2}
    maxSize={1024 * 1024}
    onReject={(next) => {
        rejections = next;
    }}
    class="flex w-full max-w-xl flex-col gap-3"
>
    <div class="flex flex-wrap items-center gap-3">
        <Attachment.Trigger variant="outline">Add images</Attachment.Trigger>
        <p class="text-sm text-foreground-muted">Two images, 1 MB each.</p>
    </div>
    {#if rejections.length > 0}
        <ul class="flex flex-col gap-1 text-sm text-error">
            {#each rejections as rejection (rejection.file)}
                <li class="min-w-0 truncate">
                    <span class="font-label">{rejection.file.name}</span>
                    {rejection.reason}
                </li>
            {/each}
        </ul>
    {/if}
    <Attachment.List />
</Attachment.Root>
