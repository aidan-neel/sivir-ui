<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import CodeIcon from '@lucide/svelte/icons/code';
    import Maximize2 from '@lucide/svelte/icons/maximize-2';
    import RefreshCw from '@lucide/svelte/icons/refresh-cw';
    import X from '@lucide/svelte/icons/x';
    import Button from '@sivir-ui/svelte/components/button';
    import * as CodeBlock from '@sivir-ui/svelte/components/code-block';
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount, type Snippet, tick, untrack } from 'svelte';
    import PreviewActions from './preview-actions.svelte';
    import PreviewDock from './preview-dock.svelte';

    let {
        children,
        examples,
        controls,
        props,
        changed = 0,
        code,
        class: classProp,
        refreshable = false,
        fill = false,
        swapKey
    }: {
        children?: Snippet;
        examples?: Snippet;
        controls?: Snippet;
        props?: Snippet;
        changed?: number;
        code: string;
        class?: string;
        refreshable?: boolean;
        fill?: boolean;
        swapKey?: string;
    } = $props();

    const COLLAPSED_LINES = 12;
    const SWAP_DURATION = 240;
    const SWAP_EASING = 'cubic-bezier(0.25, 1, 0.5, 1)';
    const COLLAPSED_HEIGHT = `calc(var(--code-block-line-height) * var(--font-size-label) * ${COLLAPSED_LINES} + var(--code-block-padding-y) * 2)`;
    const codeId = $props.id();
    const sectionId = `${codeId}-section`;

    const lineCount = $derived(code.replace(/\n$/, '').split('\n').length);
    const collapsible = $derived(lineCount > COLLAPSED_LINES + 2);

    let previewBody = $state<HTMLElement>();
    let previewVersion = $state(0);
    let refreshVersion = $state(0);
    let fullscreen = $state(false);
    let fullscreenBusy = false;
    let expanded = $state(false);
    let morphDuration = $state(0);
    let slotHeight = $state<number>();
    let slot = $state<HTMLDivElement>();
    let surface = $state<HTMLDivElement>();
    let fullscreenTrigger = $state<HTMLButtonElement | HTMLAnchorElement>();
    let fullscreenClose = $state<HTMLButtonElement | HTMLAnchorElement>();
    let codeShown = $state(false);
    let sectionContentHeight = $state(0);
    let codeResizing = $state(false);
    let codeViewport = $state<HTMLDivElement>();
    let codeExpanded = $state(false);
    let codeHeight = $state<string | undefined>(
        untrack(() => {
            return collapsible ? COLLAPSED_HEIGHT : undefined;
        })
    );

    const sectionHeight = $derived(`${codeShown ? sectionContentHeight : 0}px`);

    let swapFrom: number | undefined;
    let swapReady = false;

    $effect.pre(() => {
        void swapKey;

        untrack(() => {
            swapFrom = previewBody?.offsetHeight;
        });
    });

    $effect(() => {
        void swapKey;

        untrack(() => {
            playSwap();
        });
    });

    $effect.pre(() => {
        void code;
        const nextCollapsible = collapsible;

        untrack(() => {
            codeExpanded = false;
            codeHeight = nextCollapsible ? COLLAPSED_HEIGHT : undefined;
        });
    });

    function hasTransition(node: HTMLElement) {
        const durations = getComputedStyle(node).transitionDuration.split(',');

        return durations.some((duration) => {
            return Number.parseFloat(duration) > 0;
        });
    }

    function playSwap() {
        if (!swapReady) {
            swapReady = true;

            return;
        }

        if (!previewBody || matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        const to = previewBody.offsetHeight;

        if (swapFrom !== undefined && swapFrom !== to && !fullscreen) {
            previewBody.animate([{ height: `${swapFrom}px` }, { height: `${to}px` }], {
                duration: SWAP_DURATION,
                easing: SWAP_EASING
            });
        }

        previewBody.firstElementChild?.animate(
            [
                {
                    opacity: 0,
                    filter: 'blur(2px)',
                    transform: 'scale(0.98)'
                },
                {
                    opacity: 1,
                    filter: 'blur(0)',
                    transform: 'scale(1)'
                }
            ],
            {
                duration: SWAP_DURATION,
                easing: SWAP_EASING
            }
        );
    }

    function toggleSection() {
        codeShown = !codeShown;
    }

    async function toggleCode() {
        if (!codeViewport) {
            return;
        }
        const from = codeViewport.offsetHeight;
        const next = !codeExpanded;

        codeResizing = true;
        codeExpanded = next;
        codeHeight = `${from}px`;
        await tick();
        void codeViewport.offsetHeight;

        if (next) {
            const cap = Number.parseFloat(getComputedStyle(codeViewport).maxHeight);
            const target = Math.min(codeViewport.scrollHeight, cap);

            codeHeight = `${target}px`;
        } else {
            codeViewport.scrollTop = 0;
            codeHeight = COLLAPSED_HEIGHT;
        }

        if (!hasTransition(codeViewport)) {
            codeResizing = false;

            if (next) {
                codeHeight = undefined;
            }
        }
    }

    function releaseCodeHeight(event: TransitionEvent) {
        if (event.target !== event.currentTarget || event.propertyName !== 'height') {
            return;
        }
        codeResizing = false;

        if (codeExpanded) {
            codeHeight = undefined;
        }
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

    function readSurfaceRadius() {
        const previewSurface = surface?.firstElementChild;

        if (!previewSurface) {
            return '0px';
        }
        return getComputedStyle(previewSurface).borderTopLeftRadius;
    }

    async function openFullscreen() {
        if (!surface || fullscreenBusy) {
            return;
        }
        fullscreenBusy = true;

        const from = surface.getBoundingClientRect();
        const radius = readSurfaceRadius();
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
        const radius = readSurfaceRadius();
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

<div data-component-preview class={cn(classProp, 'flex w-full flex-col gap-2')}>
    <div
        class="flex w-full flex-col overflow-hidden rounded-[var(--radius-xl)] border-[length:var(--border-size)] border-border bg-card"
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
                <div
                    class={cn(
                        'relative flex w-full flex-col overflow-hidden bg-card',
                        fullscreen
                            ? 'h-full max-h-none rounded-[inherit]'
                            : 'max-h-[40rem] rounded-t-[calc(var(--radius-xl)-var(--border-size))]'
                    )}
                >
                    {#if !fullscreen}
                        <div
                            class="pointer-events-none absolute inset-x-2 top-2 z-10 flex items-start justify-between gap-2 [&>*]:pointer-events-auto"
                        >
                            <PreviewDock {examples} {controls} {props} {changed} />
                            <div class="ml-auto max-w-full">
                                <PreviewActions>
                                    {#if refreshable}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            class="size-7 shrink-0 rounded-md"
                                            aria-label="Replay preview"
                                            onclick={refreshPreview}
                                        >
                                            {#key refreshVersion}
                                                <RefreshCw
                                                    size={14}
                                                    aria-hidden="true"
                                                    class={refreshVersion > 0 ? 'sivir-preview-refresh' : undefined}
                                                />
                                            {/key}
                                        </Button>
                                    {/if}
                                    <Button
                                        bind:element={fullscreenTrigger}
                                        size="icon"
                                        variant="ghost"
                                        class="size-7 shrink-0 rounded-md"
                                        aria-label="Open preview full screen"
                                        onclick={openFullscreen}
                                    >
                                        <Maximize2 size={14} aria-hidden="true" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant={codeShown ? 'secondary' : 'ghost'}
                                        class="size-7 shrink-0 rounded-md"
                                        aria-label={codeShown ? 'Hide code' : 'Show code'}
                                        aria-expanded={codeShown}
                                        aria-controls={sectionId}
                                        onclick={toggleSection}
                                    >
                                        <CodeIcon size={14} aria-hidden="true" />
                                    </Button>
                                </PreviewActions>
                            </div>
                        </div>
                    {/if}
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
                                : 'min-h-[20rem] overflow-hidden p-6 pt-16 sm:p-10 sm:pt-16',
                            'flex w-full items-center justify-center transition-[padding] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] focus:outline-none motion-reduce:transition-none'
                        )}
                    >
                        {#key previewVersion}
                            {@render children?.()}
                        {/key}
                    </div>
                </div>
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

        <div
            id={sectionId}
            inert={!codeShown}
            style:height={sectionHeight}
            class={cn(
                'overflow-hidden transition-[height] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
                codeShown
                    ? '[transition-duration:var(--motion-duration-sheet)]'
                    : '[transition-duration:var(--motion-duration-sheet-out)]',
                codeResizing && 'transition-none'
            )}
        >
            <div
                bind:offsetHeight={sectionContentHeight}
                class={cn(
                    'relative flex flex-col border-t-[length:var(--border-size)] border-border transition-[opacity,translate,filter] ease-[var(--ease-out)] [--code-block-line-height:1.7] [--code-block-max-height:none] [--code-block-padding-x:1.1rem] [--code-block-padding-y:0.9rem] motion-reduce:transition-none',
                    codeShown
                        ? 'translate-y-0 opacity-100 blur-none [transition-delay:80ms] [transition-duration:var(--motion-duration-sheet)]'
                        : '-translate-y-1.5 opacity-0 blur-[2px] [transition-duration:var(--motion-duration-panel-out)]'
                )}
            >
                <CopyButton
                    text={code}
                    label="Copy code"
                    class="absolute top-2 right-2 z-10 bg-card text-foreground-muted"
                />
                <div
                    bind:this={codeViewport}
                    id={codeId}
                    ontransitionend={releaseCodeHeight}
                    style:height={codeHeight}
                    class={cn(
                        'relative max-h-[40rem] transition-[height] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
                        codeExpanded
                            ? 'overflow-y-auto [transition-duration:var(--motion-duration-sheet)]'
                            : 'overflow-hidden [transition-duration:var(--motion-duration-sheet-out)]',
                        collapsible && 'pb-12'
                    )}
                >
                    <CodeBlock.Content {code} lang="svelte" class="rounded-none bg-transparent" />
                    {#if collapsible}
                        <div
                            aria-hidden="true"
                            class={cn(
                                'pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card to-transparent transition-opacity [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none',
                                codeExpanded ? 'opacity-0' : 'opacity-100'
                            )}
                        ></div>
                    {/if}
                </div>
                {#if collapsible}
                    <Button
                        variant="outline"
                        class="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 gap-1.5 bg-card"
                        aria-expanded={codeExpanded}
                        aria-controls={codeId}
                        onclick={toggleCode}
                    >
                        {codeExpanded ? 'Collapse code' : 'Expand code'}
                        <ChevronDown
                            size={14}
                            aria-hidden="true"
                            class={cn(
                                'transition-transform [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none',
                                codeExpanded && 'rotate-180'
                            )}
                        />
                    </Button>
                {/if}
            </div>
        </div>
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
