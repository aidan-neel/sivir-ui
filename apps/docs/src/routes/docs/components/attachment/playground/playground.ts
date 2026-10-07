export type AttachmentMaxFiles = 'none' | '3' | '5';

export type AttachmentSettings = {
    multiple: boolean;
    maxFiles: AttachmentMaxFiles;
    disabled: boolean;
    addOnPaste: boolean;
};

export const attachmentDefaults: AttachmentSettings = {
    multiple: true,
    maxFiles: '3',
    disabled: false,
    addOnPaste: true
};

const LIMIT_SENTENCES: Record<AttachmentMaxFiles, string> = {
    none: '',
    '3': ' Three files at most.',
    '5': ' Five files at most.'
};

export function attachmentMaxFiles(settings: AttachmentSettings) {
    if (settings.maxFiles === 'none') {
        return null;
    }
    return Number(settings.maxFiles);
}

function attachmentCopy(settings: AttachmentSettings) {
    const sources = settings.addOnPaste ? 'Drop, paste, or choose' : 'Drop or choose';

    if (!settings.multiple) {
        return {
            heading: `${sources} a file`,
            hint: 'PNG, JPG, or PDF up to 5 MB.',
            trigger: 'Choose a file'
        };
    }
    return {
        heading: `${sources} files`,
        hint: `PNG, JPG, or PDF up to 5 MB.${LIMIT_SENTENCES[settings.maxFiles]}`,
        trigger: 'Choose files'
    };
}

function rootProps(settings: AttachmentSettings) {
    const props = ['bind:files', 'accept="image/png,image/jpeg,.pdf"'];
    const maxFiles = attachmentMaxFiles(settings);

    if (!settings.multiple) {
        props.push('multiple={false}');
    }
    if (settings.multiple && maxFiles !== null) {
        props.push(`maxFiles={${maxFiles}}`);
    }
    props.push('maxSize={5 * 1024 * 1024}');

    if (!settings.addOnPaste) {
        props.push('addOnPaste={false}');
    }
    if (settings.disabled) {
        props.push('disabled');
    }
    props.push('class="flex w-full max-w-xl flex-col gap-3"');

    return props
        .map((prop) => {
            return `    ${prop}`;
        })
        .join('\n');
}

export function attachmentCode(settings: AttachmentSettings) {
    const copy = attachmentCopy(settings);

    return `<script lang="ts">
    import * as Attachment from '@sivir-ui/svelte/components/attachment';

    let files = $state<File[]>([]);
</script>

<Attachment.Root
${rootProps(settings)}
>
    <div
        class="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border-[length:var(--border-size)] border-dashed border-border px-6 py-8 text-center"
    >
        <div class="flex flex-col gap-1">
            <p class="text-sm font-label text-foreground">${copy.heading}</p>
            <p class="text-xs text-foreground-muted">${copy.hint}</p>
        </div>
        <Attachment.Trigger variant="outline">${copy.trigger}</Attachment.Trigger>
    </div>
    <Attachment.List class="grid-cols-1" />
</Attachment.Root>
`;
}

export function changedAttachmentProps(settings: AttachmentSettings) {
    const changes = [
        settings.multiple !== attachmentDefaults.multiple,
        settings.multiple && settings.maxFiles !== attachmentDefaults.maxFiles,
        settings.disabled !== attachmentDefaults.disabled,
        settings.addOnPaste !== attachmentDefaults.addOnPaste
    ];

    return changes.filter(Boolean).length;
}
