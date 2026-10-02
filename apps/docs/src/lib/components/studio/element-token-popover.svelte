<script lang="ts" generics="Row extends NamedTokenRow">
    import CornerLeftUp from '@lucide/svelte/icons/corner-left-up';
    import X from '@lucide/svelte/icons/x';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import type { Snippet } from 'svelte';
    // biome-ignore lint/correctness/noUnusedImports: referenced by the generics attribute
    import type { NamedTokenRow } from '$lib/studio/studio-chrome';
    import { surfaceTransition } from '$lib/studio/studio-chrome';

    type Section = {
        id: string;
        label: string;
        rows: Row[];
    };

    type Props = {
        target: Element;
        name: string;
        detail: string;
        sections: Section[];
        overrides: number;
        row: Snippet<[Row]>;
        onReset: () => void;
        onClose: () => void;
        onParent?: () => void;
        onHighlight: (name: string | null) => void;
    };

    const {
        target,
        name,
        detail,
        sections,
        overrides,
        row,
        onReset,
        onClose,
        onParent,
        onHighlight
    }: Props = $props();

    const GAP = 12;
    const LABEL_CLEARANCE = 24;
    const EDGE = 12;

    let popover = $state<HTMLElement>();
    let tab = $state('');
    let top = $state(0);
    let left = $state(0);
    let above = $state(false);

    const activeSection = $derived(
        sections.find((section) => {
            return section.id === tab;
        }) ?? sections[0]
    );

    function place() {
        if (!popover) {
            return;
        }

        const rect = target.getBoundingClientRect();
        const width = popover.offsetWidth;
        const height = popover.offsetHeight;
        const fitsBelow = rect.bottom + GAP + height <= window.innerHeight - EDGE;
        const fitsAbove = rect.top - GAP - LABEL_CLEARANCE - height >= EDGE;
        const maxLeft = window.innerWidth - width - EDGE;

        above = !fitsBelow && fitsAbove;
        left = Math.max(EDGE, Math.min(rect.left, maxLeft));

        if (fitsBelow) {
            top = rect.bottom + GAP;
            return;
        }

        if (fitsAbove) {
            top = rect.top - GAP - LABEL_CLEARANCE - height;
            return;
        }

        top = Math.max(EDGE, window.innerHeight - height - EDGE);
    }

    $effect(() => {
        void target;

        if (!popover) {
            return;
        }

        let pending = 0;

        function schedule() {
            cancelAnimationFrame(pending);
            pending = requestAnimationFrame(place);
        }

        const observer = new ResizeObserver(schedule);

        observer.observe(popover);
        observer.observe(target);
        place();
        window.addEventListener('scroll', schedule, true);
        window.addEventListener('resize', schedule);

        return () => {
            cancelAnimationFrame(pending);
            observer.disconnect();
            window.removeEventListener('scroll', schedule, true);
            window.removeEventListener('resize', schedule);
        };
    });
</script>

<div
    bind:this={popover}
    role="dialog"
    aria-label={`${name} tokens`}
    class="sivir-modal-frame fixed z-50 flex max-h-[min(30rem,calc(100dvh-1.5rem))] w-[22rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden text-foreground shadow-[var(--elevation-float)] [--sivir-modal-inset:calc(var(--spacing)*0.5)]"
    style:top={`${top}px`}
    style:left={`${left}px`}
    style:transform-origin={above ? 'bottom left' : 'top left'}
    in:surfaceTransition={{ y: above ? 6 : -6 }}
    out:surfaceTransition={{ y: above ? 6 : -6, direction: 'out' }}
>
    <div class="sivir-inset-surface flex min-h-0 flex-1 flex-col">
        <header class="flex items-center gap-2 pt-3 pr-2 pb-2 pl-4">
            <div class="flex min-w-0 flex-1 items-baseline gap-2">
                <Typography.Text class="shrink-0 font-medium">{name}</Typography.Text>
                <Typography.Metadata class="truncate tabular-nums">{detail}</Typography.Metadata>
            </div>
            {#if onParent}
                <Button
                    variant="ghost"
                    size="icon"
                    class="shrink-0"
                    aria-label="Select parent"
                    onclick={onParent}
                >
                    <CornerLeftUp size={15} />
                </Button>
            {/if}
            <Button
                variant="ghost"
                size="icon"
                class="shrink-0"
                aria-label="Close"
                onclick={onClose}
            >
                <X size={15} />
            </Button>
        </header>

        {#if sections.length > 1}
            <div class="hide-scrollbar-all shrink-0 overflow-x-auto px-3 pb-2">
                <ToggleGroup.Root
                    type="single"
                    value={activeSection?.id}
                    onValueChange={(value) => {
                        if (typeof value === 'string' && value) {
                            tab = value;
                        }
                    }}
                >
                    {#each sections as section (section.id)}
                        <ToggleGroup.Item value={section.id} class="whitespace-nowrap">
                            {section.label}
                        </ToggleGroup.Item>
                    {/each}
                </ToggleGroup.Root>
            </div>
        {/if}

        <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
            {#if activeSection}
                <div class="flex flex-col gap-1.5 pt-1">
                    {#each activeSection.rows as item (item.definition.name)}
                        <div
                            role="group"
                            onpointerenter={() => {
                                onHighlight(item.definition.name);
                            }}
                            onpointerleave={() => {
                                onHighlight(null);
                            }}
                            onfocusin={() => {
                                onHighlight(item.definition.name);
                            }}
                            onfocusout={() => {
                                onHighlight(null);
                            }}
                        >
                            {@render row(item)}
                        </div>
                    {/each}
                </div>
            {:else}
                <Typography.Metadata class="block py-4">
                    No editable tokens here. Try the parent.
                </Typography.Metadata>
            {/if}
        </div>

        <footer class="flex shrink-0 items-center gap-3 border-t border-border py-1.5 pr-2 pl-4">
            <Typography.Metadata class="flex-1 tabular-nums">
                {#if overrides === 0}
                    No overrides
                {:else}
                    {overrides}
                    {overrides === 1 ? 'override' : 'overrides'}
                {/if}
            </Typography.Metadata>
            <Button variant="ghost" size="sm" disabled={overrides === 0} onclick={onReset}>
                Reset
            </Button>
        </footer>
    </div>
</div>
