<script lang="ts">
    import FileIcon from '@lucide/svelte/icons/file';
    import FileArchive from '@lucide/svelte/icons/file-archive';
    import FileCode from '@lucide/svelte/icons/file-code';
    import FileImage from '@lucide/svelte/icons/file-image';
    import FileMusic from '@lucide/svelte/icons/file-music';
    import FilePlay from '@lucide/svelte/icons/file-play';
    import FileSpreadsheet from '@lucide/svelte/icons/file-spreadsheet';
    import FileText from '@lucide/svelte/icons/file-text';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { AttachmentPreviewProps } from '.';
    import { getAttachmentItemContext } from './context.svelte';
    import { fileKind } from './format';

    let { class: className, ...rest }: AttachmentPreviewProps = $props();

    const item = getAttachmentItemContext();
    const icons = {
        image: FileImage,
        video: FilePlay,
        audio: FileMusic,
        archive: FileArchive,
        code: FileCode,
        sheet: FileSpreadsheet,
        text: FileText,
        other: FileIcon
    };

    let loaded = $state(false);

    const kind = $derived(fileKind(item.file));
    const Icon = $derived(icons[kind]);
    const preview = $derived.by(() => {
        const previewFile = item.file;

        return (node: HTMLImageElement) => {
            const url = URL.createObjectURL(previewFile);
            loaded = false;
            node.src = url;

            return () => {
                URL.revokeObjectURL(url);
            };
        };
    });
</script>

<div
    {...rest}
    data-ui="attachment-preview"
    data-kind={kind}
    class={cn(
        className,
        'relative col-start-1 row-span-2 row-start-1 me-3 grid size-[var(--size-touch)] shrink-0 place-items-center overflow-hidden rounded-[var(--radius-md)] bg-secondary text-foreground-muted after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-[color-mix(in_srgb,var(--color-foreground)_10%,transparent)]'
    )}
>
    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
    {#if kind === 'image'}
        <img
            {@attach preview}
            alt=""
            draggable="false"
            data-loaded={loaded || undefined}
            onload={() => {
                loaded = true;
            }}
            class="absolute inset-0 size-full object-cover opacity-0 transition-opacity [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none data-loaded:opacity-100"
        />
    {/if}
</div>
