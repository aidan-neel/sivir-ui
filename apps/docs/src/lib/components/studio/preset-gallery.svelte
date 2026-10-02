<script lang="ts">
    import X from '@lucide/svelte/icons/x';
    import { Button } from '@sivir-ui/svelte/components/button';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import type { Theme } from '@sivir-ui/svelte/themes/theme';
    import { presetSwatch, type StudioMode, surfaceTransition } from '$lib/studio/studio-chrome';

    type Props = {
        presets: readonly Theme[];
        mode: StudioMode;
        activeSlug: string;
        previewSlug: string | null;
        onPreview: (slug: string | null) => void;
        onApply: (slug: string) => void;
        onClose: () => void;
    };

    const { presets, mode, activeSlug, previewSlug, onPreview, onApply, onClose }: Props = $props();

    let cards = $state<HTMLButtonElement[]>([]);

    const previewName = $derived(
        presets.find((preset) => {
            return preset.slug === previewSlug;
        })?.name ?? null
    );

    function focusCard(index: number) {
        const count = presets.length;
        const next = cards[(index + count) % count];
        next?.focus();
    }

    function handleKeydown(event: KeyboardEvent, index: number) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            focusCard(index + 1);
            return;
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            focusCard(index - 1);
            return;
        }
        if (event.key === 'Home') {
            event.preventDefault();
            focusCard(0);
            return;
        }
        if (event.key === 'End') {
            event.preventDefault();
            focusCard(presets.length - 1);
            return;
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            onPreview(null);
            onClose();
        }
    }
</script>

<svelte:window
    onkeydown={(event) => {
        if (event.key === 'Escape' && !event.defaultPrevented) {
            onPreview(null);
            onClose();
        }
    }}
/>

<section
    aria-label="Theme presets"
    class="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-border bg-[var(--color-card)] p-3 shadow-[var(--elevation-float)]"
>
    <header class="flex min-w-0 items-center gap-3 px-1">
        <div class="flex min-w-0 flex-1 items-baseline gap-2">
            <Typography.Text class="shrink-0 font-medium">Presets</Typography.Text>
            <Typography.Metadata class="truncate" aria-live="polite">
                {#if previewName}
                    Previewing {previewName}. Press Enter to apply, Esc to return to your draft.
                {:else}
                    Hover or arrow through a preset to preview it on the page.
                {/if}
            </Typography.Metadata>
        </div>
        <Button
            variant="ghost"
            size="icon"
            class="-my-1 shrink-0"
            aria-label="Close presets"
            onclick={() => {
                onPreview(null);
                onClose();
            }}
        >
            <X size={15} />
        </Button>
    </header>

    <div
        role="group"
        aria-label="Presets"
        class="hide-scrollbar-all -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1"
        onpointerleave={() => {
            onPreview(null);
        }}
    >
        {#each presets as preset, index (preset.slug)}
            {@const swatch = presetSwatch(preset, mode)}
            <button
                bind:this={cards[index]}
                type="button"
                class="group flex w-44 shrink-0 snap-start flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background text-left transition-[border-color,box-shadow] [transition-duration:var(--motion-duration-hover)] hover:cursor-[var(--ui-cursor-interactive)] hover:border-foreground/30 focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none aria-[current=true]:border-primary"
                aria-current={preset.slug === activeSlug}
                onpointerenter={() => {
                    onPreview(preset.slug);
                }}
                onfocus={() => {
                    onPreview(preset.slug);
                }}
                onkeydown={(event) => {
                    handleKeydown(event, index);
                }}
                onclick={() => {
                    onApply(preset.slug);
                }}
                in:surfaceTransition|global={{ y: -4, delay: 40 + index * 24 }}
            >
                <span
                    class="flex flex-col gap-2.5 border-b px-3 pt-3 pb-3.5"
                    style:background-color={swatch.background}
                    style:border-color={swatch.border}
                    aria-hidden="true"
                >
                    <span class="flex items-center gap-1.5">
                        <span
                            class="rounded-[5px] px-2 py-1 text-[11px] leading-none font-medium"
                            style:background-color={swatch.brand}
                            style:color={swatch.onBrand}
                        >
                            Save
                        </span>
                        <span
                            class="rounded-[5px] border px-2 py-1 text-[11px] leading-none font-medium"
                            style:background-color={swatch.base}
                            style:border-color={swatch.border}
                            style:color={swatch.foreground}
                        >
                            Cancel
                        </span>
                    </span>
                    <span
                        class="block h-1 overflow-hidden rounded-full"
                        style:background-color={swatch.border}
                    >
                        <span
                            class="block h-full w-3/5 rounded-full"
                            style:background-color={swatch.brand}
                        ></span>
                    </span>
                </span>
                <span class="flex flex-col gap-0.5 px-3 py-2.5">
                    <span class="truncate text-[13px] font-medium text-foreground">
                        {preset.name}
                    </span>
                    <span class="truncate text-xs text-foreground-muted">
                        {preset.slug === activeSlug ? 'Current base' : 'Built-in'}
                    </span>
                </span>
            </button>
        {/each}
    </div>

    <footer class="hidden items-center gap-4 px-1 sm:flex">
        <Typography.Metadata class="flex items-center gap-1.5">
            <Shortcut shortcut="enter" />
            Apply
        </Typography.Metadata>
        <Typography.Metadata class="flex items-center gap-1.5">
            <Shortcut shortcut="esc" />
            Back to draft
        </Typography.Metadata>
    </footer>
</section>
