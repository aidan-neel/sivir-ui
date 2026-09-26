<script lang="ts">
    import CircleAlert from '@lucide/svelte/icons/circle-alert';
    import CircleCheck from '@lucide/svelte/icons/circle-check';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import { panelIn } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { AttachmentStatusProps } from '.';
    import { getAttachmentItemContext } from './context.svelte';
    import { formatBytes } from './format';

    let { class: className, ...rest }: AttachmentStatusProps = $props();

    const item = getAttachmentItemContext();
    const size = $derived(formatBytes(item.file.size));
    const message = $derived(item.error || 'Attachment failed');
</script>

<div
    {...rest}
    data-ui="attachment-status"
    data-state={item.status}
    class={cn(
        className,
        'col-start-2 row-start-2 mt-0.5 flex h-4 min-w-0 items-center text-xs tabular-nums text-foreground-muted'
    )}
>
    {#key item.status}
        <div in:panelIn class="flex min-w-0 flex-1 items-center gap-1.5">
            {#if item.status === 'uploading'}
                <div
                    data-ui="attachment-progress"
                    role="progressbar"
                    aria-label={`Upload progress for ${item.file.name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={item.progress}
                    class="flex min-w-0 flex-1 items-center gap-2"
                >
                    {#if item.progress === undefined}
                        <Spinner size={12} aria-hidden="true" />
                        <span class="truncate">Uploading</span>
                    {:else}
                        <span class="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-secondary">
                            <span
                                class="block h-full rounded-full bg-primary transition-[width] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none"
                                style:width={`${item.progress}%`}
                            ></span>
                        </span>
                        <span class="w-[4ch] shrink-0 text-end">{Math.round(item.progress)}%</span>
                    {/if}
                </div>
            {:else if item.status === 'complete'}
                <span role="status" class="flex min-w-0 items-center gap-1.5">
                    <CircleCheck
                        size={12}
                        strokeWidth={2}
                        aria-hidden="true"
                        class="shrink-0 text-success"
                    />
                    <span class="text-success">Complete</span>
                    <span aria-hidden="true">·</span>
                    <span class="truncate">{size}</span>
                </span>
            {:else if item.status === 'error'}
                <span role="alert" class="flex min-w-0 items-center gap-1.5 text-error">
                    <CircleAlert size={12} strokeWidth={2} aria-hidden="true" class="shrink-0" />
                    <span class="truncate" title={message}>{message}</span>
                </span>
            {:else}
                <span class="truncate">{size}</span>
            {/if}
        </div>
    {/key}
</div>
