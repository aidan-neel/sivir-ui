<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { AttachmentNameProps } from '.';
    import { getAttachmentItemContext } from './context.svelte';
    import { splitFileName } from './format';

    let { class: className, ...rest }: AttachmentNameProps = $props();

    const item = getAttachmentItemContext();
    const parts = $derived(splitFileName(item.file.name));
</script>

<span
    {...rest}
    data-ui="attachment-name"
    title={item.file.name}
    class={cn(
        className,
        'col-start-2 row-start-1 me-2 flex min-w-0 text-sm leading-5 font-label text-foreground in-data-[ui=composer-form]:me-0 in-data-[ui=composer-form]:max-w-48'
    )}
>
    <span class="truncate">{parts.base}</span><span class="shrink-0">{parts.extension}</span>
</span>
