<script lang="ts">
    import CircleAlert from '@lucide/svelte/icons/circle-alert';
    import CircleCheck from '@lucide/svelte/icons/circle-check';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import { getCssDuration } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import { cubicOut } from 'svelte/easing';
    import type { TransitionConfig } from 'svelte/transition';
    import type { AttachmentStatusProps } from '.';
    import { getAttachmentItemContext } from './context.svelte';
    import { formatBytes } from './format';

    let { class: className, ...rest }: AttachmentStatusProps = $props();

    const item = getAttachmentItemContext();
    const size = $derived(formatBytes(item.file.size));
    const message = $derived(item.error || 'Attachment failed');

    function frame(t: number) {
        return `opacity:${t};transform:translateY(${(1 - t) * 3}px);filter:blur(${(1 - t) * 2}px)`;
    }

    function enter(node: Element): TransitionConfig {
        return {
            duration: getCssDuration(node, '--motion-duration-panel-in', 110),
            easing: cubicOut,
            css: frame
        };
    }

    function leave(node: Element): TransitionConfig {
        return {
            duration: getCssDuration(node, '--motion-duration-panel-out', 150),
            easing: cubicOut,
            css: frame
        };
    }
</script>

<div
    {...rest}
    data-ui="attachment-status"
    data-state={item.status}
    class={cn(
        className,
        'col-start-2 row-start-2 me-2 mt-0.5 grid h-4 min-w-0 items-center text-xs tabular-nums text-foreground-muted in-data-[ui=composer-form]:mt-0 in-data-[ui=composer-form]:me-1 in-data-[ui=composer-form]:data-[state=ready]:hidden in-data-[ui=composer-form]:data-[state=uploading]:w-20'
    )}
>
    {#key item.status}
        <div in:enter out:leave class="flex min-w-0 items-center gap-1.5 [grid-area:1/1]">
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
                        <span
                            class="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-foreground)_10%,transparent)]"
                        >
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
                    <span>Complete</span>
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
