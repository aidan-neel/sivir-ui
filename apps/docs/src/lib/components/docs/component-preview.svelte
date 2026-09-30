<script lang="ts">
    import RefreshCw from '@lucide/svelte/icons/refresh-cw';
    import Button from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
    import * as CodeBlock from '@sivir-ui/svelte/components/code-block';
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount, type Snippet, untrack } from 'svelte';

    let {
        children,
        code,
        class: classProp,
        refreshable = false,
        ...rest
    }: {
        children?: Snippet;
        code: string;
        class?: string;
        refreshable?: boolean;
    } = $props();

    let value = $state<string>('preview');
    let previewBody = $state<HTMLElement>();
    let previewVersion = $state(0);
    let refreshVersion = $state(0);
    let frame = $state<HTMLDivElement>();
    let previewPane = $state<HTMLDivElement>();
    let codePane = $state<HTMLDivElement>();
    let frameHeight = $state<number>();
    let codeMounted = $state(false);
    let previousValue = untrack(() => value);

    $effect.pre(() => {
        const next = value;

        if (next === previousValue) {
            return;
        }
        previousValue = next;

        untrack(() => {
            if (frame) {
                frameHeight = frame.offsetHeight;
            }
            if (next === 'code') {
                codeMounted = true;
            }
        });

        requestAnimationFrame(() => {
            const pane = next === 'code' ? codePane : previewPane;

            if (value !== next) {
                return;
            }
            if (!pane || !frame || !hasTransition(frame) || pane.offsetHeight === frameHeight) {
                frameHeight = undefined;
                return;
            }
            frameHeight = pane.offsetHeight;
        });
    });

    function hasTransition(node: HTMLElement) {
        const durations = getComputedStyle(node).transitionDuration.split(',');

        return durations.some((duration) => {
            return Number.parseFloat(duration) > 0;
        });
    }

    function releaseHeight(event: TransitionEvent) {
        if (event.target !== event.currentTarget || event.propertyName !== 'height') {
            return;
        }
        frameHeight = undefined;
    }

    function refreshPreview() {
        previewVersion += 1;
        refreshVersion += 1;
    }

    onMount(() => {
        // Drop initial focus into the first preview on the page so the user can
        // Tab straight into the demo instead of walking through the chrome first.
        if (
            previewBody &&
            previewBody.closest('[data-component-preview]') ===
                document.querySelector('[data-component-preview]')
        ) {
            previewBody.focus({ preventScroll: true });
        }
    });
</script>

<div class="flex flex-col gap-3.5" data-component-preview>
    <!-- Tabs (using library Tabs component; segmented = pill-on-track switcher) -->
    <div class="flex items-center justify-between gap-3">
        <Tabs.Root bind:value variant="segmented">
            <Tabs.List class="w-fit">
                <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
                <Tabs.Trigger value="code">Code</Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
        {#if refreshable}
            <Button
                size="icon"
                variant="ghost"
                class="size-7 rounded-md"
                aria-label="Replay preview"
                onclick={refreshPreview}
            >
                {#key refreshVersion}
                    <RefreshCw
                        size={14}
                        class={refreshVersion > 0 ? 'sivir-preview-refresh' : undefined}
                    />
                {/key}
            </Button>
        {/if}
    </div>

    <div
        bind:this={frame}
        ontransitionend={releaseHeight}
        style:height={frameHeight === undefined ? undefined : `${frameHeight}px`}
        class={[
            'relative transition-[height] [transition-duration:calc(var(--motion-duration-panel)*1.5)] ease-[var(--ease-out)] motion-reduce:transition-none',
            frameHeight !== undefined && 'overflow-hidden'
        ]}
    >
        <div
            bind:this={previewPane}
            inert={value !== 'preview'}
            aria-hidden={value !== 'preview'}
            class={cn(
                'w-full transition-[opacity,filter] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none',
                value === 'preview'
                    ? 'relative opacity-100 blur-[0px]'
                    : 'pointer-events-none absolute inset-x-0 top-0 opacity-0 blur-[2px]'
            )}
        >
            <!-- Preview sits on Card's panel surface. -->
            <Card.Root
                {...rest}
                variant="panel"
                class={cn(
                    classProp,
                    'w-full max-h-[40rem] overflow-hidden [&>[data-ui=card-surface]]:p-0'
                )}
            >
                <div
                    bind:this={previewBody}
                    tabindex="-1"
                    class="flex min-h-[20rem] w-full items-center justify-center overflow-hidden p-6 sm:p-10 focus:outline-none"
                >
                    {#key previewVersion}
                        {@render children?.()}
                    {/key}
                </div>
            </Card.Root>
        </div>
        {#if codeMounted}
            <div
                bind:this={codePane}
                inert={value !== 'code'}
                aria-hidden={value !== 'code'}
                class={cn(
                    'w-full transition-[opacity,filter] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none',
                    value === 'code'
                        ? 'relative opacity-100 blur-[0px]'
                        : 'pointer-events-none absolute inset-x-0 top-0 opacity-0 blur-[2px]'
                )}
            >
                <!-- Code is a CodeBlock — it carries its own panel frame, so it stands alone. -->
                <CodeBlock.Root
                    {...rest}
                    {code}
                    lang="svelte"
                    copy="overlay"
                    class={cn(classProp, 'w-full max-h-[40rem] overflow-auto')}
                />
            </div>
        {/if}
    </div>
</div>

<style>
    @media (prefers-reduced-motion: no-preference) {
        :global(.sivir-preview-refresh) {
            animation: sivir-preview-refresh 360ms var(--ease-out) both;
        }
    }

    @keyframes sivir-preview-refresh {
        to {
            rotate: 360deg;
        }
    }
</style>
