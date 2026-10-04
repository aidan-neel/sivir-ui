<script lang="ts">
    import Maximize2 from '@lucide/svelte/icons/maximize-2';
    import RefreshCw from '@lucide/svelte/icons/refresh-cw';
    import X from '@lucide/svelte/icons/x';
    import Button from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
    import * as CodeBlock from '@sivir-ui/svelte/components/code-block';
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount, type Snippet, tick, untrack } from 'svelte';

    let {
        children,
        code,
        class: classProp,
        refreshable = false,
        fill = false,
        ...rest
    }: {
        children?: Snippet;
        code: string;
        class?: string;
        refreshable?: boolean;
        fill?: boolean;
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
    let fullscreen = $state(false);
    let fullscreenBusy = false;
    let expanded = $state(false);
    let morphDuration = $state(0);
    let slotHeight = $state<number>();
    let slot = $state<HTMLDivElement>();
    let surface = $state<HTMLDivElement>();
    let fullscreenTrigger = $state<HTMLButtonElement | HTMLAnchorElement>();
    let fullscreenClose = $state<HTMLButtonElement | HTMLAnchorElement>();

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

    function portal(node: HTMLElement) {
        document.body.appendChild(node);

        return {
            destroy() {
                node.remove();
            }
        };
    }

    function hasOpenModal() {
        return document.querySelector('[data-overlay-root] [aria-modal="true"]') !== null;
    }

    function dismissDemoModal() {
        document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
        );
    }

    function readFullscreenMotion(direction: 'open' | 'close') {
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

        return {
            duration: reduced ? 0 : direction === 'open' ? 460 : 360,
            easing: 'cubic-bezier(0.32, 0.72, 0, 1)'
        };
    }

    function toFrame(rect: DOMRect, radius: string) {
        return {
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            borderRadius: radius
        };
    }

    function viewportFrame() {
        return {
            top: '0px',
            left: '0px',
            width: `${document.documentElement.clientWidth}px`,
            height: `${window.innerHeight}px`,
            borderRadius: '0px'
        };
    }

    function readCardRadius() {
        const card = surface?.firstElementChild;

        if (!card) {
            return '0px';
        }
        return getComputedStyle(card).borderTopLeftRadius;
    }

    async function openFullscreen() {
        if (!surface || fullscreenBusy) {
            return;
        }
        fullscreenBusy = true;

        const from = surface.getBoundingClientRect();
        const radius = readCardRadius();
        const { duration, easing } = readFullscreenMotion('open');

        slotHeight = from.height;
        morphDuration = duration;
        fullscreen = true;
        await tick();
        void surface.offsetWidth;
        expanded = true;

        fullscreenClose?.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: duration * 0.5,
            delay: duration * 0.5,
            easing: 'ease-out',
            fill: 'backwards'
        });

        const animation = surface.animate([toFrame(from, radius), viewportFrame()], {
            duration,
            easing
        });

        await animation.finished.catch(() => undefined);
        fullscreenClose?.focus();
        fullscreenBusy = false;
    }

    async function closeFullscreen() {
        if (!surface || !slot || fullscreenBusy) {
            return;
        }
        fullscreenBusy = true;

        const to = slot.getBoundingClientRect();
        const radius = readCardRadius();
        const { duration, easing } = readFullscreenMotion('close');

        morphDuration = duration;
        expanded = false;

        if (hasOpenModal()) {
            dismissDemoModal();
        }

        fullscreenClose?.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: duration * 0.35,
            easing: 'ease-in',
            fill: 'forwards'
        });

        const animation = surface.animate([viewportFrame(), toFrame(to, radius)], {
            duration,
            easing,
            fill: 'forwards'
        });

        await animation.finished.catch(() => undefined);
        fullscreen = false;
        await tick();
        animation.cancel();
        slotHeight = undefined;

        if (hasOpenModal()) {
            previewVersion += 1;
        }

        fullscreenTrigger?.focus();
        fullscreenBusy = false;
    }

    function handleWindowKeydown(event: KeyboardEvent) {
        if (fullscreen && event.key === 'Escape') {
            event.preventDefault();
            closeFullscreen();
        }
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

<svelte:window onkeydown={handleWindowKeydown} />

<div class="flex flex-col gap-3.5" data-component-preview>
    <!-- Tabs (using library Tabs component; segmented = pill-on-track switcher) -->
    <div class="flex items-center justify-between gap-3">
        <Tabs.Root bind:value variant="segmented">
            <Tabs.List class="w-fit">
                <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
                <Tabs.Trigger value="code">Code</Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
        <div class="flex items-center gap-1">
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
            {#if value === 'preview'}
                <Button
                    bind:element={fullscreenTrigger}
                    size="icon"
                    variant="ghost"
                    class="size-7 rounded-md"
                    aria-label="Open preview full screen"
                    onclick={openFullscreen}
                >
                    <Maximize2 size={14} aria-hidden="true" />
                </Button>
            {/if}
        </div>
    </div>

    <div
        bind:this={frame}
        ontransitionend={releaseHeight}
        style:height={frameHeight === undefined ? undefined : `${frameHeight}px`}
        class={[
            'relative transition-[height] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none',
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
                    ? 'relative opacity-100'
                    : 'pointer-events-none absolute inset-x-0 top-0 opacity-0 blur-[2px]'
            )}
        >
            <div
                bind:this={slot}
                style:height={slotHeight === undefined ? undefined : `${slotHeight}px`}
            >
                <div
                    bind:this={surface}
                    role={fullscreen ? 'dialog' : undefined}
                    aria-label={fullscreen ? 'Full screen preview' : undefined}
                    class={fullscreen
                        ? 'fixed top-0 left-0 z-50 h-dvh w-screen overflow-hidden bg-background will-change-[top,left,width,height]'
                        : undefined}
                >
                    <Card.Root
                        {...rest}
                        variant="panel"
                        class={cn(
                            classProp,
                            'w-full overflow-hidden [&>[data-ui=card-surface]]:p-0',
                            fullscreen ? 'h-full max-h-none rounded-[inherit]' : 'max-h-[40rem]'
                        )}
                    >
                        <div
                            bind:this={previewBody}
                            tabindex="-1"
                            style:transition-duration={`${morphDuration}ms`}
                            class={cn(
                                fullscreen
                                    ? fill
                                        ? [
                                              'min-h-0 flex-1 items-stretch overflow-hidden [&>*]:!h-full [&>*]:!max-h-none [&>*]:[transition-duration:inherit] [&>*]:[transition-property:border-radius,border-color] [&>*]:[transition-timing-function:cubic-bezier(0.32,0.72,0,1)]',
                                              expanded
                                                  ? 'p-0 [&>*]:!rounded-none [&>*]:!border-transparent'
                                                  : 'p-6 sm:p-10'
                                          ]
                                        : 'min-h-0 flex-1 overflow-auto p-6 sm:p-10'
                                    : 'min-h-[20rem] overflow-hidden p-6 sm:p-10',
                                'flex w-full items-center justify-center transition-[padding] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] focus:outline-none motion-reduce:transition-none'
                            )}
                        >
                            {#key previewVersion}
                                {@render children?.()}
                            {/key}
                        </div>
                    </Card.Root>
                    {#if fullscreen}
                        <div use:portal data-overlay-root>
                            <Button
                                bind:element={fullscreenClose}
                                size="icon"
                                variant="ghost"
                                class={fill
                                    ? 'fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[150] size-11 rounded-md border border-border bg-card shadow-[var(--elevation-1)] sm:size-9'
                                    : 'fixed top-3 right-3 z-[150] size-10 rounded-md sm:size-8'}
                                aria-label="Close full screen preview"
                                onclick={closeFullscreen}
                            >
                                <X size={18} aria-hidden="true" />
                            </Button>
                        </div>
                    {/if}
                </div>
            </div>
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
