<script lang="ts">
    import Globe from '@lucide/svelte/icons/globe';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { SourceIconProps } from '.';

    let { src, fallback, class: className, ...rest }: SourceIconProps = $props();

    let failedSrc = $state<string>();
    const showImage = $derived(Boolean(src) && failedSrc !== src);
    const initial = $derived(fallback?.trim().charAt(0).toUpperCase());
</script>

<span
    {...rest}
    aria-hidden="true"
    data-ui="source-icon"
    class={cn(
        className,
        'inline-flex size-3.5 shrink-0 items-center justify-center overflow-hidden rounded-full in-[p]:size-3'
    )}
>
    {#if showImage}
        <img
            {src}
            alt=""
            loading="lazy"
            decoding="async"
            class="size-full object-contain"
            onerror={() => {
                failedSrc = src;
            }}
        />
    {:else if initial}
        <span
            class="flex size-full items-center justify-center bg-foreground/10 text-[calc(var(--spacing)*2.25)] leading-none font-[var(--font-weight-label)] text-foreground"
        >
            {initial}
        </span>
    {:else}
        <Globe class="size-full" />
    {/if}
</span>
