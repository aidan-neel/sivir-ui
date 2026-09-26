<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { AttachmentItemProps } from '.';
    import Name from './attachment-name.svelte';
    import Preview from './attachment-preview.svelte';
    import Remove from './attachment-remove.svelte';
    import Status from './attachment-status.svelte';
    import { findAttachmentContext, setAttachmentItemContext } from './context.svelte';

    let {
        file,
        status = 'ready',
        progress,
        error,
        onRemove,
        removable = true,
        children,
        class: className,
        ...rest
    }: AttachmentItemProps = $props();

    const root = findAttachmentContext();
    const handleRemove = $derived(onRemove ?? root?.remove);
    const canRemove = $derived(removable && !root?.disabled && handleRemove !== undefined);

    setAttachmentItemContext({
        get file() {
            return file;
        },
        get status() {
            return status;
        },
        get progress() {
            return progress === undefined ? undefined : Math.min(100, Math.max(0, progress));
        },
        get error() {
            return error;
        },
        get removable() {
            return canRemove;
        },
        remove() {
            if (canRemove) {
                handleRemove?.(file);
            }
        }
    });
</script>

<div
    {...rest}
    data-ui="attachment-item"
    data-state={status}
    class={cn(
        className,
        'grid min-w-0 grid-flow-col grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_auto] items-center rounded-[var(--radius-lg)] border-[length:var(--border-size)] border-border bg-card p-2 text-foreground transition-[border-color] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none data-[state=error]:border-error not-has-[>[data-ui=attachment-status]]:[&>[data-ui=attachment-name]]:row-span-2 [&>:not([data-ui=attachment-preview],[data-ui=attachment-name],[data-ui=attachment-status])]:row-span-2 [&>:not([data-ui=attachment-preview],[data-ui=attachment-name],[data-ui=attachment-status])]:ms-2'
    )}
>
    {#if children}
        {@render children()}
    {:else}
        <Preview />
        <Name />
        <Status />
        <Remove />
    {/if}
</div>
