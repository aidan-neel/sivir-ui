<script lang="ts">
    import Code from '@lucide/svelte/icons/code';
    import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { PreviewMorph } from '$lib/components/docs';
    import CodePanel from './code-panel.svelte';
    import CountBadge from './count-badge.svelte';

    let {
        morphKey,
        code,
        children,
        examples,
        controls,
        props,
        changed = 0,
        stageClass
    }: {
        morphKey: string;
        code: string;
        children: Snippet;
        examples?: Snippet;
        controls?: Snippet;
        props?: Snippet;
        changed?: number;
        stageClass?: string;
    } = $props();

    const drawerId = $props.id();

    let codeOpen = $state(false);
    let propsOpen = $state(false);
    let codeHeight = $state(0);
</script>

{#snippet divider()}
    <span aria-hidden="true" class="mx-1 hidden h-5 w-px shrink-0 bg-border sm:block"></span>
{/snippet}

<div class="flex flex-col gap-2">
    <div
        class="overflow-hidden rounded-[var(--radius-xl)] border-[length:var(--border-size)] border-border bg-card"
    >
        <div
            class={cn(
                'flex min-h-[20rem] items-center justify-center px-6 py-10',
                stageClass
            )}
        >
            <PreviewMorph key={morphKey}> {@render children()} </PreviewMorph>
        </div>
        <div
            id={drawerId}
            inert={!codeOpen}
            style:height="{codeOpen ? codeHeight : 0}px"
            class={cn(
                'overflow-hidden transition-[height] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
                codeOpen
                    ? '[transition-duration:var(--motion-duration-sheet)]'
                    : '[transition-duration:var(--motion-duration-sheet-out)]'
            )}
        >
            <div
                bind:offsetHeight={codeHeight}
                class={cn(
                    'border-t-[length:var(--border-size)] border-border transition-[opacity,translate,filter] ease-[var(--ease-out)] motion-reduce:transition-none',
                    codeOpen
                        ? 'translate-y-0 opacity-100 blur-none [transition-delay:80ms] [transition-duration:var(--motion-duration-sheet)]'
                        : '-translate-y-1.5 opacity-0 blur-[2px] [transition-duration:var(--motion-duration-panel-out)]'
                )}
            >
                <CodePanel {code} />
            </div>
        </div>
    </div>
    <div class="flex justify-center">
        <div
            class="flex max-w-full items-center gap-1 overflow-x-auto rounded-[var(--radius-xl)] border-[length:var(--border-size)] border-border bg-card p-1 [scrollbar-width:none]"
        >
            {#if examples}
                {@render examples()}
                {@render divider()}
            {/if}
            {#if controls}
                {@render controls()}
            {/if}
            {#if props}
                <Popover.Root bind:open={propsOpen} placement="top-end">
                    <Popover.Trigger
                        variant={propsOpen ? 'secondary' : 'ghost'}
                        size="sm"
                        class="shrink-0 gap-1.5"
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
            {@render divider()}
            <Button
                size="icon"
                variant={codeOpen ? 'secondary' : 'ghost'}
                class="size-7 shrink-0 rounded-md"
                aria-label={codeOpen ? 'Hide code' : 'Show code'}
                aria-expanded={codeOpen}
                aria-controls={drawerId}
                onclick={() => {
                    codeOpen = !codeOpen;
                }}
            >
                <Code size={14} aria-hidden="true" />
            </Button>
        </div>
    </div>
</div>
