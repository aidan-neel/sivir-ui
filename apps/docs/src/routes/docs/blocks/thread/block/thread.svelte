<script lang="ts">
    import Globe from '@lucide/svelte/icons/globe';
    import Lightbulb from '@lucide/svelte/icons/lightbulb';
    import * as Message from '@sivir-ui/svelte/components/message';
    import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
    import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';
    import * as Source from '@sivir-ui/svelte/components/source';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import { getCssDuration, themedSlide } from '@sivir-ui/svelte/transition';
    import { onDestroy, onMount } from 'svelte';
    import { cubicOut } from 'svelte/easing';
    import type { TransitionConfig } from 'svelte/transition';
    import {
        answer,
        question,
        searchedSources,
        searchQuery,
        type ThreadCitation,
        thoughts
    } from './thread-script';

    type Stage = 'thinking' | 'searching' | 'reading' | 'reflecting' | 'answering' | 'done';

    const answerSegments = answer.flatMap((paragraph, paragraphIndex) => {
        return paragraph.map((segment) => {
            return {
                ...segment,
                paragraphIndex
            };
        });
    });

    const paragraphStarts = answer.map((_, paragraphIndex) => {
        return answerSegments.findIndex((segment) => {
            return segment.paragraphIndex === paragraphIndex;
        });
    });

    let stage = $state<Stage>('thinking');
    let readCount = $state(0);
    let searchOpen = $state(true);
    let thoughtCount = $state(0);
    let thoughtsDone = $state(0);
    let answerIndex = $state(-1);
    let answerDone = $state(0);

    const timers = new Set<ReturnType<typeof setTimeout>>();

    const streaming = $derived(stage !== 'answering' && stage !== 'done');
    const reading = $derived(searchedSources[readCount - 1]);

    const status = $derived.by(() => {
        if (stage === 'searching') {
            return 'Searching the web';
        }
        if (stage === 'reading') {
            return `Reading ${readCount} of ${searchedSources.length} sources`;
        }
        return 'Thinking';
    });

    const searchTitle = $derived.by(() => {
        if (stage === 'searching') {
            return `Searching for “${searchQuery}”`;
        }
        if (stage === 'reading' && reading) {
            return `Reading ${reading.domain}`;
        }

        return `Searched ${searchedSources.length} websites`;
    });

    function chipIn(
        node: Element,
        {
            delay = 0
        }: {
            delay?: number;
        } = {}
    ): TransitionConfig {
        const duration = getCssDuration(node, '--motion-duration-panel', 180) * 2;

        return {
            delay,
            duration,
            easing: cubicOut,
            css: (t, u) => {
                return `opacity: ${t}; filter: blur(${u * 4}px); transform: translateY(${u * 3}px) scale(${0.92 + t * 0.08});`;
            }
        };
    }

    function iconIn(node: Element): TransitionConfig {
        const duration = getCssDuration(node, '--motion-duration-panel', 180);

        return {
            duration,
            easing: cubicOut,
            css: (t, u) => {
                return `opacity: ${t}; transform: scale(${0.6 + t * 0.4}) rotate(${u * -45}deg);`;
            }
        };
    }

    function later(delay: number, run: () => void) {
        const timer = setTimeout(() => {
            timers.delete(timer);
            run();
        }, delay);

        timers.add(timer);
    }

    function readNext() {
        if (readCount === searchedSources.length) {
            stage = 'reflecting';
            thoughtCount = 1;

            return;
        }

        stage = 'reading';
        readCount += 1;
        later(1000, readNext);
    }

    function finishThought() {
        thoughtsDone += 1;

        if (thoughtsDone < thoughts.length) {
            later(350, () => {
                thoughtCount += 1;
            });

            return;
        }

        later(600, () => {
            stage = 'answering';
            later(450, () => {
                answerIndex = 0;
            });
        });
    }

    function finishSegment() {
        answerDone += 1;

        if (answerDone === answerSegments.length) {
            stage = 'done';

            return;
        }

        later(200, () => {
            answerIndex += 1;
        });
    }

    onMount(() => {
        later(700, () => {
            stage = 'searching';
            later(1200, readNext);
        });
    });

    onDestroy(() => {
        for (const timer of timers) {
            clearTimeout(timer);
        }
    });
</script>

{#snippet citation(item: ThreadCitation)}
    {@const [first] = item.sources}
    <span in:chipIn={{ delay: 120 }} class="inline-block">
        <Source.Root href={first.href} count={item.sources.length}>
            <Source.Icon src={first.icon} fallback={first.domain} />
            <Source.Label>{item.label}</Source.Label>
            <Source.Count />
            <Source.Content>
                {#each item.sources as source (source.href)}
                    <Source.Item href={source.href}>
                        <Source.Icon src={source.icon} fallback={source.domain} />
                        <Source.Label>{source.domain}</Source.Label>
                        <Source.Title>{source.title}</Source.Title>
                        <Source.Description>{source.description}</Source.Description>
                    </Source.Item>
                {/each}
            </Source.Content>
        </Source.Root>
    </span>
{/snippet}

<div class="flex w-full flex-col gap-8">
    <Message.Root from="user">
        <Message.Content>{question}</Message.Content>
    </Message.Root>

    <Message.Root from="assistant" status={stage === 'done' ? 'idle' : 'streaming'}>
        <Message.Content class="flex flex-col gap-4">
            <Reasoning.Root {streaming}>
                <Reasoning.Trigger {status}>
                    {#snippet icon(state)}
                        <Reasoning.Orb active={state.streaming} />
                    {/snippet}
                </Reasoning.Trigger>
                <Reasoning.Content>
                    <Reasoning.Steps>
                        {#if stage !== 'thinking'}
                            <Reasoning.Step
                                title={searchTitle}
                                status={stage === 'searching' || stage === 'reading'
                                    ? 'active'
                                    : 'complete'}
                                collapsible={readCount > 0}
                                bind:open={searchOpen}
                            >
                                {#snippet icon()}
                                    {#if stage === 'searching' || stage === 'reading'}
                                        <Spinner size={14} aria-hidden="true" />
                                    {:else}
                                        <span in:iconIn class="flex">
                                            <Globe />
                                        </span>
                                    {/if}
                                {/snippet}
                                {#if readCount > 0}
                                    <div
                                        in:themedSlide={{ durationVar: '--motion-duration-panel' }}
                                        class="flex flex-wrap gap-1.5 pt-0.5"
                                    >
                                        {#each searchedSources.slice(0, readCount) as source (source.href)}
                                            <span in:chipIn class="flex min-w-0">
                                                <Source.Root href={source.href}>
                                                    <Source.Icon
                                                        src={source.icon}
                                                        fallback={source.domain}
                                                    />
                                                    <Source.Label>{source.domain}</Source.Label>
                                                </Source.Root>
                                            </span>
                                        {/each}
                                    </div>
                                {/if}
                            </Reasoning.Step>
                        {/if}

                        {#each thoughts.slice(0, thoughtCount) as thought, index (thought.title)}
                            <Reasoning.Step
                                title={thought.title}
                                status={index < thoughtsDone ? 'complete' : 'active'}
                            >
                                {#snippet icon()}
                                    <Lightbulb />
                                {/snippet}
                                <ResponseStream
                                    as="p"
                                    class="m-0 text-sm font-normal text-foreground"
                                    textStream={thought.body}
                                    speed={60}
                                    onComplete={finishThought}
                                />
                            </Reasoning.Step>
                        {/each}
                    </Reasoning.Steps>
                </Reasoning.Content>
            </Reasoning.Root>

            {#each answer as paragraph, paragraphIndex (paragraphStarts[paragraphIndex])}
                {#if answerIndex >= paragraphStarts[paragraphIndex]}
                    <p class="m-0">
                        {#each paragraph as segment, segmentIndex (segment.text)}
                            {@const index = paragraphStarts[paragraphIndex] + segmentIndex}
                            {#if answerIndex >= index}
                                <ResponseStream
                                    class="inline font-normal"
                                    textStream={segment.text}
                                    speed={70}
                                    onComplete={finishSegment}
                                />
                                {#if segment.citation && answerDone > index}
                                    {@render citation(segment.citation)}
                                {/if}
                                {#if index === answerIndex && answerDone === index}
                                    <span
                                        aria-hidden="true"
                                        class="ml-0.5 inline-block h-[1em] w-[0.45em] translate-y-[0.15em] rounded-[1px] bg-foreground/70"
                                    ></span>
                                {/if}
                                {' '}
                            {/if}
                        {/each}
                    </p>
                {/if}
            {/each}
        </Message.Content>
    </Message.Root>
</div>
