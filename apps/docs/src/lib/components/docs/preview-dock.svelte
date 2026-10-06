<script lang="ts">
    import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import type { Snippet } from 'svelte';
    import CountBadge from './count-badge.svelte';

    let {
        examples,
        controls,
        props,
        changed = 0
    }: {
        examples?: Snippet;
        controls?: Snippet;
        props?: Snippet;
        changed?: number;
    } = $props();

    let propsOpen = $state(false);
</script>

{#if examples || controls || props}
    <div
        class="flex max-w-full items-center gap-1 self-start overflow-x-auto [scrollbar-width:none]"
    >
        {#if examples}
            {@render examples()}
        {/if}
        {#if controls}
            {@render controls()}
        {/if}
        {#if props}
            <Popover.Root bind:open={propsOpen} placement="bottom-start">
                <Popover.Trigger
                    variant={propsOpen ? 'secondary' : 'ghost'}
                    size="sm"
                    class="h-7 shrink-0 gap-1.5 px-2.5 text-[0.8125rem]"
                >
                    <SlidersHorizontal size={14} aria-hidden="true" />
                    Props
                    <CountBadge count={changed} />
                </Popover.Trigger>
                <Popover.Content aria-label="Props" class="w-80 max-w-[calc(100vw-2rem)]">
                    <div class="flex flex-col gap-3">
                        {@render props()}
                    </div>
                </Popover.Content>
            </Popover.Root>
        {/if}
    </div>
{/if}
