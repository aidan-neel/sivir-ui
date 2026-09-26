<script lang="ts">
    import ArrowLeft from '@lucide/svelte/icons/arrow-left';
    import { Button } from '@sivir-ui/svelte/components/button';
    import type { QuestionAnswer } from '@sivir-ui/svelte/components/question';
    import * as Question from '@sivir-ui/svelte/components/question';

    const questions = [
        {
            title: 'Where should we start?',
            description: 'Choose a starting point for the next round of work.',
            options: [
                {
                    value: 'interface',
                    label: 'The interface',
                    description: 'Refine the screens people use every day.'
                },
                {
                    value: 'workflow',
                    label: 'The workflow',
                    description: 'Make the path from start to finish simpler.'
                },
                {
                    value: 'foundation',
                    label: 'The foundation',
                    description: 'Improve the architecture behind the product.'
                }
            ]
        },
        {
            title: 'How much should change?',
            description: 'Set the scope so the work stays focused.',
            options: [
                {
                    value: 'polish',
                    label: 'A little polish',
                    description: 'Keep the structure and refine the details.'
                },
                {
                    value: 'focused',
                    label: 'A focused update',
                    description: 'Rework one part of the experience.'
                },
                {
                    value: 'rethink',
                    label: 'A fresh direction',
                    description: 'Explore a different approach from the ground up.'
                }
            ]
        },
        {
            title: 'What should I bring back?',
            description: 'Choose what you want to review before we continue.',
            options: [
                {
                    value: 'plan',
                    label: 'A clear plan',
                    description: 'Outline the changes and their trade-offs.'
                },
                {
                    value: 'prototype',
                    label: 'A working prototype',
                    description: 'Make the idea tangible and easy to try.'
                },
                {
                    value: 'implementation',
                    label: 'The implementation',
                    description: 'Build the change and summarize the result.'
                }
            ]
        }
    ];
    let step = $state(0);
    let answers = $state<QuestionAnswer[]>(['', '', '']);
    const complete = $derived(step === questions.length);
    const question = $derived(questions[Math.min(step, questions.length - 1)]);

    function next() {
        if (!complete) {
            step += 1;
        }
    }

    function restart() {
        answers = ['', '', ''];
        step = 0;
    }
</script>

<div class="w-full max-w-xl">
    <Question.Root variant="inset" bind:value={answers[step]} required={!complete} onSubmit={next}>
        <Question.Content {step}>
            {#if complete}
                <Question.Title>Ready to get started</Question.Title>
                <Question.Description>
                    Here’s the direction you chose. You can go back to adjust it.
                </Question.Description>
                <dl class="grid gap-4 px-4 py-5">
                    {#each questions as item, index (item.title)}
                        <div class="grid gap-1">
                            <dt class="text-xs text-foreground-muted">{item.title}</dt>
                            <dd class="m-0 text-sm font-medium">
                                {item.options.find((option) => option.value === answers[index])?.label}
                            </dd>
                        </div>
                    {/each}
                </dl>
            {:else}
                <Question.Title>{question.title}</Question.Title>
                <Question.Description>{question.description}</Question.Description>
                <Question.Options>
                    {#each question.options as option (option.value)}
                        <Question.Option {...option} />
                    {/each}
                </Question.Options>
            {/if}
        </Question.Content>
        <Question.Actions>
            <span class="me-auto text-xs tabular-nums text-foreground-muted" role="status">
                {complete ? 'All questions answered' : `Question ${step + 1} of ${questions.length}`}
            </span>
            <Question.Cancel
                disabled={step === 0}
                onclick={(event) => {
                    event.preventDefault();
                    step -= 1;
                }}
            >
                <ArrowLeft size={14} aria-hidden="true" />
                Back
            </Question.Cancel>
            {#if complete}
                <Button type="button" variant="primary" size="md" onclick={restart}>
                    Start again
                </Button>
            {:else}
                <Question.Submit label={step === questions.length - 1 ? 'Finish' : 'Next'} />
            {/if}
        </Question.Actions>
    </Question.Root>
</div>
