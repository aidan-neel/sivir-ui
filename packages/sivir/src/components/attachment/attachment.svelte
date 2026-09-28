<script lang="ts">
    import CircleAlert from '@lucide/svelte/icons/circle-alert';
    import Paperclip from '@lucide/svelte/icons/paperclip';
    import { overlayIn, overlayOut, panelIn } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { AttachmentProps, AttachmentRejection } from '.';
    import { setAttachmentContext } from './context.svelte';
    import { formatBytes } from './format';

    let {
        files = $bindable([]),
        accept,
        multiple = true,
        maxFiles,
        maxSize,
        disabled = false,
        addOnPaste = true,
        onReject,
        children,
        class: className,
        ondragenter,
        ondragover,
        ondragleave,
        ondrop,
        onpaste,
        ...rest
    }: AttachmentProps = $props();

    let input: HTMLInputElement | undefined;
    let dragDepth = 0;
    let dragging = $state(false);
    let dragRejection = $state<string | undefined>();
    let announcement = $state('');

    const limit = $derived(Math.max(0, Math.min(multiple ? Infinity : 1, maxFiles ?? Infinity)));
    const rules = $derived(
        accept
            ?.split(',')
            .map((rule) => rule.trim().toLowerCase())
            .filter(Boolean) ?? []
    );

    function fileKey(file: File) {
        return `${file.name}\u0000${file.size}\u0000${file.lastModified}`;
    }

    function limitReason() {
        return `Only ${limit} ${limit === 1 ? 'attachment is' : 'attachments are'} allowed.`;
    }

    function typeReason() {
        return `This file type is not accepted${accept ? ` (${accept})` : ''}.`;
    }

    function matchesType(rule: string, type: string) {
        if (rule.endsWith('/*')) {
            return type.startsWith(rule.slice(0, -1));
        }

        return type === rule;
    }

    function acceptsFile(file: File) {
        if (!rules.length) {
            return true;
        }

        const name = file.name.toLowerCase();
        const type = file.type.toLowerCase();

        return rules.some((rule) => {
            if (rule.startsWith('.')) {
                return name.endsWith(rule);
            }

            return matchesType(rule, type);
        });
    }

    function describeCount(count: number, fallback: string) {
        return count === 1 ? fallback : `${count} files`;
    }

    function addFiles(incoming: Iterable<File>) {
        if (disabled) {
            return;
        }

        const accepted: File[] = [];
        const rejections: AttachmentRejection[] = [];
        const keys = new Set(files.map(fileKey));

        for (const file of incoming) {
            const key = fileKey(file);
            if (keys.has(key)) {
                rejections.push({
                    file,
                    code: 'duplicate-file',
                    reason: 'A file with the same name, size, and modified date is already attached.'
                });
                continue;
            }
            if (!acceptsFile(file)) {
                rejections.push({
                    file,
                    code: 'file-invalid-type',
                    reason: typeReason()
                });
                continue;
            }
            if (maxSize !== undefined && file.size > maxSize) {
                rejections.push({
                    file,
                    code: 'file-too-large',
                    reason: `This file is larger than the ${formatBytes(maxSize)} limit.`
                });
                continue;
            }
            if (files.length + accepted.length >= limit) {
                rejections.push({
                    file,
                    code: 'too-many-files',
                    reason: limitReason()
                });
                continue;
            }

            keys.add(key);
            accepted.push(file);
        }

        const messages: string[] = [];

        if (accepted.length) {
            files = [...files, ...accepted];
            messages.push(`${describeCount(accepted.length, accepted[0].name)} attached.`);
        }
        if (rejections.length) {
            const [first] = rejections;
            messages.push(
                rejections.length === 1
                    ? `${first.file.name} not attached. ${first.reason}`
                    : `${rejections.length} files not attached.`
            );
            onReject?.(rejections);
        }

        announcement = messages.join(' ');
    }

    function hasDraggedFiles(event: DragEvent) {
        return Array.from(event.dataTransfer?.types ?? []).includes('Files');
    }

    function previewRejection(transfer: DataTransfer | null) {
        if (files.length >= limit) {
            return limitReason();
        }
        if (!transfer || !rules.length || rules.some((rule) => rule.startsWith('.'))) {
            return undefined;
        }

        const types = Array.from(transfer.items)
            .filter((item) => item.kind === 'file')
            .map((item) => item.type.toLowerCase());
        const known = types.length > 0 && types.every(Boolean);
        const matched = types.some((type) => {
            return rules.some((rule) => matchesType(rule, type));
        });

        return known && !matched ? typeReason() : undefined;
    }

    function endDrag() {
        dragDepth = 0;
        dragging = false;
        dragRejection = undefined;
    }

    setAttachmentContext({
        get files() {
            return files;
        },
        set files(next: File[]) {
            files = next;
        },
        get disabled() {
            return disabled;
        },
        open() {
            if (!disabled) {
                input?.click();
            }
        },
        remove(file: File) {
            if (disabled || !files.includes(file)) {
                return;
            }

            files = files.filter((candidate) => candidate !== file);
            announcement = `${file.name} removed.`;
        }
    });
</script>

<div
    {...rest}
    data-ui="attachment"
    data-state={dragging ? 'dragging' : 'idle'}
    data-disabled={disabled || undefined}
    data-invalid={(dragging && dragRejection !== undefined) || undefined}
    ondragenter={(event) => {
        ondragenter?.(event);
        if (event.defaultPrevented || !hasDraggedFiles(event)) {
            return;
        }
        event.preventDefault();
        if (disabled) {
            return;
        }
        if (dragDepth === 0) {
            dragRejection = previewRejection(event.dataTransfer);
        }
        dragDepth += 1;
        dragging = true;
    }}
    ondragover={(event) => {
        ondragover?.(event);
        if (event.defaultPrevented || !hasDraggedFiles(event)) {
            return;
        }
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
        }
    }}
    ondragleave={(event) => {
        ondragleave?.(event);
        if (disabled || !dragging) {
            return;
        }
        dragDepth = Math.max(0, dragDepth - 1);
        const next = event.relatedTarget;
        const inside = next instanceof Node ? event.currentTarget.contains(next) : dragDepth > 0;
        if (!inside) {
            endDrag();
        }
    }}
    ondrop={(event) => {
        ondrop?.(event);
        const hasFiles = hasDraggedFiles(event);
        const handled = event.defaultPrevented;
        event.preventDefault();
        endDrag();
        if (!handled && hasFiles && !disabled && event.dataTransfer) {
            addFiles(event.dataTransfer.files);
        }
    }}
    onpaste={(event) => {
        onpaste?.(event);
        const pasted = event.clipboardData?.files;
        if (event.defaultPrevented || !addOnPaste || disabled || !pasted?.length) {
            return;
        }
        event.preventDefault();
        addFiles(pasted);
    }}
    class={cn(className, 'relative min-w-0')}
>
    <input
        bind:this={input}
        class="hidden"
        type="file"
        tabindex={-1}
        {accept}
        {multiple}
        {disabled}
        onchange={(event) => {
            if (event.currentTarget.files) {
                addFiles(event.currentTarget.files);
            }
            event.currentTarget.value = '';
        }}
    />

    {@render children?.()}

    <span role="status" aria-live="polite" class="sr-only">{announcement}</span>

    {#if dragging}
        <div
            in:overlayIn
            out:overlayOut
            data-ui="attachment-drop-overlay"
            data-state={dragRejection ? 'invalid' : 'dragging'}
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 z-10 grid place-items-center rounded-[var(--radius-lg)] border-[1.5px] border-dashed border-[color-mix(in_srgb,var(--color-primary)_55%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--color-card))] px-3 text-primary data-[state=invalid]:border-[color-mix(in_srgb,var(--color-error)_55%,transparent)] data-[state=invalid]:bg-[color-mix(in_srgb,var(--color-error)_6%,var(--color-card))] data-[state=invalid]:text-error"
        >
            <span
                in:panelIn
                class="flex min-w-0 max-w-full items-center gap-2 text-sm font-label text-balance"
            >
                {#if dragRejection}
                    <CircleAlert size={16} strokeWidth={2} class="shrink-0" />
                    {dragRejection}
                {:else}
                    <Paperclip size={16} strokeWidth={2} class="shrink-0" />
                    Drop to attach
                {/if}
            </span>
        </div>
    {/if}
</div>
