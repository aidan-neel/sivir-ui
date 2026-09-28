<script lang="ts">
    import RotateCw from '@lucide/svelte/icons/rotate-cw';
    import type { AttachmentStatus } from '@sivir-ui/svelte/components/attachment';
    import * as Attachment from '@sivir-ui/svelte/components/attachment';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { onDestroy } from 'svelte';
    import { SvelteMap } from 'svelte/reactivity';

    type Upload = {
        status: AttachmentStatus;
        progress?: number;
        error?: string;
    };

    let files = $state<File[]>([]);

    const uploads = new SvelteMap<File, Upload>();
    const timers = new Map<File, ReturnType<typeof setInterval>>();
    const attempts = new Map<File, number>();

    function stop(file: File) {
        clearInterval(timers.get(file));
        timers.delete(file);
    }

    function upload(file: File) {
        stop(file);

        const attempt = (attempts.get(file) ?? 0) + 1;
        const failsOnce = attempt === 1 && files.indexOf(file) === 1;
        let progress = 0;

        attempts.set(file, attempt);
        uploads.set(file, {
            status: 'uploading',
            progress
        });

        const timer = setInterval(() => {
            progress = Math.min(100, progress + 6 + Math.random() * 14);

            if (failsOnce && progress >= 45) {
                stop(file);
                uploads.set(file, {
                    status: 'error',
                    error: 'Connection lost'
                });
                return;
            }

            if (progress >= 100) {
                stop(file);
                uploads.set(file, {
                    status: 'complete'
                });
                return;
            }

            uploads.set(file, {
                status: 'uploading',
                progress
            });
        }, 200);

        timers.set(file, timer);
    }

    function setFiles(next: File[]) {
        for (const file of files) {
            if (!next.includes(file)) {
                stop(file);
                uploads.delete(file);
            }
        }

        files = next;

        for (const file of next) {
            if (!uploads.has(file)) {
                upload(file);
            }
        }
    }

    onDestroy(() => {
        for (const file of timers.keys()) {
            stop(file);
        }
    });
</script>

<Attachment.Root bind:files={() => files, setFiles} class="flex w-full max-w-xl flex-col gap-3">
    <Attachment.Trigger variant="outline" class="self-start">Upload files</Attachment.Trigger>
    <Attachment.List class="grid-cols-1">
        {#snippet children(file)}
            {@const current = uploads.get(file)}
            <Attachment.Item
                {file}
                status={current?.status}
                progress={current?.progress}
                error={current?.error}
            >
                <Attachment.Preview />
                <Attachment.Name />
                <Attachment.Status />
                {#if current?.status === 'error'}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Retry ${file.name}`}
                        onclick={() => upload(file)}
                        class="size-7 min-w-7 rounded-full text-foreground-muted hover:text-foreground"
                    >
                        <RotateCw size={14} strokeWidth={2} aria-hidden="true" />
                    </Button>
                {/if}
                <Attachment.Remove />
            </Attachment.Item>
        {/snippet}
    </Attachment.List>
</Attachment.Root>
