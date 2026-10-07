<script lang="ts">
    import FilePenLine from '@lucide/svelte/icons/file-pen-line';
    import FileText from '@lucide/svelte/icons/file-text';
    import Search from '@lucide/svelte/icons/search';
    import Terminal from '@lucide/svelte/icons/terminal';
    import * as FileDiff from '@sivir-ui/svelte/components/file-diff';
    import * as Message from '@sivir-ui/svelte/components/message';
    import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
    import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import * as Tool from '@sivir-ui/svelte/components/tool';
    import { getCssDuration, themedSlide } from '@sivir-ui/svelte/transition';
    import { onDestroy } from 'svelte';
    import { cubicOut } from 'svelte/easing';
    import { SvelteSet } from 'svelte/reactivity';
    import type { TransitionConfig } from 'svelte/transition';
    import {
        type AgentCall,
        answer,
        calls,
        changedFiles,
        question,
        thought,
        toolSummary
    } from './agent-script';

    type Stage = 'thinking' | 'working' | 'answering' | 'done';

    let stage = $state<Stage>('thinking');
    let thinkingOpen = $state(true);
    let started = $state(0);
    let finished = $state(0);
    let answerIndex = $state(-1);
    let answerDone = $state(0);

    const openCalls = new SvelteSet<string>();
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const status = $derived(calls[started - 1]?.status ?? 'Working');
    const changedLabel = $derived(
        changedFiles.length === 1 ? '1 file changed' : `${changedFiles.length} files changed`
    );

    function blockIn(node: Element): TransitionConfig {
        const duration = getCssDuration(node, '--motion-duration-panel', 180) * 2;
        const slide = themedSlide(node, {
            durationVar: '--motion-duration-panel'
        });

        return {
            duration,
            easing: cubicOut,
            css: (t, u) => {
                const geometry = slide.css?.(t, u) ?? '';

                return `${geometry} opacity: ${t}; filter: blur(${u * 3}px); transform: translateY(${u * 4}px);`;
            }
        };
    }

    function callState(call: AgentCall, index: number) {
        if (index >= finished) {
            return 'running';
        }
        if (call.failed) {
            return 'error';
        }

        return 'complete';
    }

    function later(delay: number, run: () => void) {
        const timer = setTimeout(() => {
            timers.delete(timer);
            run();
        }, delay);

        timers.add(timer);
    }

    function runNext() {
        if (started > finished) {
            const done = calls[finished];

            finished += 1;

            if (done.open) {
                openCalls.add(done.id);
            }
        }

        if (started === calls.length) {
            later(600, () => {
                stage = 'answering';
                later(300, () => {
                    answerIndex = 0;
                });
            });

            return;
        }

        started += 1;
        later(calls[started - 1].ms, runNext);
    }

    function finishThought() {
        later(500, () => {
            stage = 'working';
            thinkingOpen = false;
            later(250, runNext);
        });
    }

    function finishParagraph() {
        answerDone += 1;

        if (answerDone === answer.length) {
            later(250, () => {
                stage = 'done';
            });

            return;
        }

        later(200, () => {
            answerIndex += 1;
        });
    }

    onDestroy(() => {
        for (const timer of timers) {
            clearTimeout(timer);
        }
    });
</script>

{#snippet callIcon(call: AgentCall, live: boolean)}
    {#if live}
        <Spinner size={14} aria-hidden="true" />
    {:else if call.kind === 'search'}
        <Search />
    {:else if call.kind === 'read'}
        <FileText />
    {:else if call.kind === 'edit'}
        <FilePenLine />
    {:else}
        <Terminal />
    {/if}
{/snippet}

<div class="flex w-full flex-col gap-8">
    <Message.Root from="user">
        <Message.Content>{question}</Message.Content>
    </Message.Root>

    <Message.Root from="assistant" status={stage === 'done' ? 'idle' : 'streaming'}>
        <Message.Content class="flex flex-col gap-3">
            <Reasoning.Root streaming={stage === 'thinking'} bind:open={thinkingOpen}>
                <Reasoning.Trigger>
                    {#snippet icon(state)}
                        <Reasoning.Orb active={state.streaming} />
                    {/snippet}
                </Reasoning.Trigger>
                <Reasoning.Content>
                    <ResponseStream
                        as="p"
                        class="m-0 text-sm font-normal text-foreground-muted"
                        textStream={thought}
                        speed={30}
                        onComplete={finishThought}
                    />
                </Reasoning.Content>
            </Reasoning.Root>

            {#if started > 0}
                <div in:blockIn>
                    <Tool.Root running={stage === 'working'}>
                        <Tool.Trigger {status} summary={toolSummary} />
                        <Tool.Content>
                            {#each calls.slice(0, started) as call, index (call.id)}
                                {@const state = callState(call, index)}
                                {@const live = state === 'running'}
                                {#if call.diff}
                                    <Tool.Call
                                        action={live ? call.liveAction : call.doneAction}
                                        target={call.target}
                                        {state}
                                        open={openCalls.has(call.id)}
                                    >
                                        {#snippet icon()}
                                            {@render callIcon(call, live)}
                                        {/snippet}
                                        <FileDiff.Root
                                            file={call.target}
                                            lang="ts"
                                            diff={call.diff}
                                        />
                                    </Tool.Call>
                                {:else if call.output}
                                    <Tool.Call
                                        action={live ? call.liveAction : call.doneAction}
                                        target={call.target}
                                        {state}
                                        open={openCalls.has(call.id)}
                                    >
                                        {#snippet icon()}
                                            {@render callIcon(call, live)}
                                        {/snippet}
                                        <Tool.Output>
                                            <pre
                                                class="m-0 font-mono text-xs leading-5 whitespace-pre-wrap"
                                            >{call.output}</pre>
                                        </Tool.Output>
                                    </Tool.Call>
                                {:else}
                                    <Tool.Call
                                        action={live ? call.liveAction : call.doneAction}
                                        target={call.target}
                                        {state}
                                    >
                                        {#snippet icon()}
                                            {@render callIcon(call, live)}
                                        {/snippet}
                                    </Tool.Call>
                                {/if}
                            {/each}
                        </Tool.Content>
                    </Tool.Root>
                </div>
            {/if}

            {#each answer as paragraph, index (paragraph)}
                {#if answerIndex >= index}
                    <ResponseStream
                        as="p"
                        class="m-0 font-normal"
                        textStream={paragraph}
                        speed={70}
                        onComplete={finishParagraph}
                    />
                {/if}
            {/each}

            {#if stage === 'done'}
                <section in:blockIn aria-label={changedLabel} class="flex flex-col gap-2 pt-1">
                    <span class="text-xs text-foreground-muted">{changedLabel}</span>
                    {#each changedFiles as changed (changed.file)}
                        <FileDiff.Root
                            file={changed.file}
                            additions={changed.additions}
                            deletions={changed.deletions}
                        >
                            <FileDiff.TopBar />
                        </FileDiff.Root>
                    {/each}
                </section>
            {/if}
        </Message.Content>
    </Message.Root>
</div>
