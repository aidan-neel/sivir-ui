<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { onDestroy, untrack } from 'svelte';
    import type { ResponseStreamProps } from '.';

    type Segment = {
        id: number;
        start: number;
        end: number;
        born: number;
    };

    type Piece =
        | {
              key: string;
              kind: 'caret';
          }
        | {
              key: string;
              kind: 'settled' | 'fresh';
              text: string;
          };

    const fadeWindow = 240;
    const maxFrameGap = 64;
    const catchUpFactor = 3;
    const dotDelays = [0, 1, 2, 1, 2, 3, 2, 3, 4];

    let {
        textStream,
        streaming = false,
        speed = 20,
        characterChunkSize,
        onComplete,
        onError,
        as = 'span',
        class: className,
        ...rest
    }: ResponseStreamProps = $props();

    let shown = $state('');
    let segments = $state<Segment[]>([]);
    let sourceDone = $state(false);
    let isComplete = $state(false);
    let target = '';
    let kind: 'static' | 'live' | 'async' | undefined;
    let currentAsync: AsyncIterable<string> | undefined;
    let abortController: AbortController | undefined;
    let frame: number | undefined;
    let lastFrame = 0;
    let budget = 0;
    let nextSegmentId = 0;

    const isWaiting = $derived(shown.length === 0 && !sourceDone);
    const pieces = $derived.by((): Piece[] => {
        if (isWaiting) {
            return [
                {
                    key: 'caret',
                    kind: 'caret'
                }
            ];
        }

        const settled: Piece = {
            key: 'settled',
            kind: 'settled',
            text: shown.slice(0, segments[0]?.start ?? shown.length)
        };
        const fresh = segments.map((segment): Piece => {
            return {
                key: `fresh-${segment.id}`,
                kind: 'fresh',
                text: shown.slice(segment.start, segment.end)
            };
        });

        return [settled, ...fresh];
    });
    const streamState = $derived.by(() => {
        if (isWaiting) {
            return 'waiting';
        }
        if (isComplete) {
            return 'complete';
        }
        return 'streaming';
    });

    function prefersReducedMotion() {
        return (
            typeof window === 'undefined' ||
            typeof window.requestAnimationFrame !== 'function' ||
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
        );
    }

    function baseRate() {
        const clamped = Math.min(100, Math.max(1, speed));

        return 12 + clamped * 2.4;
    }

    function stopFrame() {
        if (frame !== undefined) {
            cancelAnimationFrame(frame);
        }
        frame = undefined;
        lastFrame = 0;
        budget = 0;
    }

    function reset() {
        stopFrame();
        abortController?.abort();
        abortController = undefined;
        currentAsync = undefined;
        target = '';
        shown = '';
        segments = [];
        sourceDone = false;
        isComplete = false;
    }

    function maybeComplete() {
        if (isComplete || !sourceDone || shown !== target) {
            return;
        }
        isComplete = true;
        onComplete?.();
    }

    function snap(text: string) {
        stopFrame();
        target = text;
        shown = text;
        segments = [];
    }

    function nextStep(elapsed: number, backlog: number) {
        const rate = kind === 'static' ? baseRate() : Math.max(baseRate(), backlog * catchUpFactor);
        budget += (elapsed / 1000) * rate;

        const whole = Math.floor(budget);
        if (whole < 1) {
            return 0;
        }
        budget -= whole;

        return Math.min(backlog, Math.max(whole, characterChunkSize ?? 1));
    }

    function tick(now: number) {
        frame = undefined;
        const elapsed = lastFrame ? Math.min(maxFrameGap, now - lastFrame) : 16;
        lastFrame = now;

        const backlog = target.length - shown.length;
        if (backlog > 0) {
            const step = nextStep(elapsed, backlog);
            if (step > 0) {
                const start = shown.length;
                const end = start + step;
                shown = target.slice(0, end);
                segments.push({
                    id: nextSegmentId++,
                    start,
                    end,
                    born: now
                });
            }
        } else {
            budget = 0;
        }

        const firstLive = segments.findIndex((segment) => {
            return now - segment.born < fadeWindow;
        });
        if (firstLive === -1) {
            segments = [];
        } else if (firstLive > 0) {
            segments = segments.slice(firstLive);
        }

        if (target.length > shown.length || segments.length > 0) {
            frame = requestAnimationFrame(tick);
            return;
        }
        lastFrame = 0;
        maybeComplete();
    }

    function schedule() {
        if (prefersReducedMotion()) {
            snap(target);
            maybeComplete();
            return;
        }
        if (frame === undefined) {
            frame = requestAnimationFrame(tick);
        }
    }

    async function consume(stream: AsyncIterable<string>) {
        const controller = new AbortController();
        abortController = controller;

        try {
            for await (const chunk of stream) {
                if (controller.signal.aborted) {
                    return;
                }
                target += chunk;
                schedule();
            }
        } catch (error) {
            if (controller.signal.aborted) {
                return;
            }
            onError?.(error);
        }

        if (controller.signal.aborted) {
            return;
        }
        sourceDone = true;
        schedule();
    }

    function syncAsync(stream: AsyncIterable<string>) {
        if (kind === 'async' && currentAsync === stream) {
            return;
        }
        reset();
        kind = 'async';
        currentAsync = stream;
        consume(stream);
    }

    function syncLive(text: string) {
        if (kind !== 'live') {
            reset();
            kind = 'live';
        }
        if (!text.startsWith(shown)) {
            snap(text);
        }
        target = text;
        sourceDone = false;
        isComplete = false;
        schedule();
    }

    function syncStatic(text: string) {
        if (kind === 'live' && text.startsWith(shown)) {
            target = text;
            sourceDone = true;
            schedule();
            return;
        }
        if (kind === 'static' && target === text) {
            return;
        }
        reset();
        kind = 'static';
        target = text;
        sourceDone = true;
        schedule();
    }

    $effect(() => {
        const source = textStream;
        const live = streaming;

        untrack(() => {
            if (typeof source !== 'string') {
                syncAsync(source);
                return;
            }
            if (live) {
                syncLive(source);
                return;
            }
            syncStatic(source);
        });
    });

    onDestroy(() => {
        stopFrame();
        abortController?.abort();
    });
</script>

<svelte:element
    this={as}
    {...rest}
    data-ui="response-stream"
    data-state={streamState}
    aria-live="polite"
    aria-busy={!isComplete}
    class={cn(
        className,
        'block font-medium whitespace-pre-wrap text-[length:var(--font-size-body)] leading-body text-foreground'
    )}
>
    {#each pieces as piece (piece.key)}
        {#if piece.kind === 'caret'}
            <span
                aria-hidden="true"
                data-ui="response-stream-caret"
                class="inline-grid -translate-y-px grid-cols-[repeat(3,3px)] gap-[1.5px] align-middle"
            >
                {#each dotDelays as delay, index (index)}
                    <span
                        class="sivir-response-stream-dot size-[3px] rounded-full bg-foreground opacity-20"
                        style:animation-delay={`${delay * 110}ms`}
                    ></span>
                {/each}
            </span>
        {:else}
            <span class={piece.kind === 'fresh' ? 'sivir-response-stream-fresh' : undefined}
                >{piece.text}</span
            >
        {/if}
    {/each}
</svelte:element>

<style>
    .sivir-response-stream-fresh {
        animation: sivir-response-stream-fresh 240ms cubic-bezier(0.23, 1, 0.32, 1) both;
    }

    .sivir-response-stream-dot {
        animation: sivir-response-stream-dot 1.1s ease-in-out infinite;
    }

    @keyframes sivir-response-stream-fresh {
        from {
            opacity: 0;
        }
    }

    @keyframes sivir-response-stream-dot {
        0%,
        100% {
            opacity: 0.2;
        }
        40% {
            opacity: 1;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-response-stream-fresh {
            animation: none;
        }

        .sivir-response-stream-dot {
            animation: none;
            opacity: 0.6;
        }
    }
</style>
