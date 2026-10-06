<script lang="ts">
    import ArrowLeft from '@lucide/svelte/icons/arrow-left';
    import { Button } from '@sivir-ui/svelte/components/button';
    import type { QuestionAnswer } from '@sivir-ui/svelte/components/question';
    import * as Question from '@sivir-ui/svelte/components/question';

    let {
        variant = 'inset',
        status = 'idle',
        disabled = false
    }: {
        variant?: 'default' | 'inset';
        status?: Question.QuestionStatus;
        disabled?: boolean;
    } = $props();

    const questions = [
        {
            title: 'Which orders should the export include?',
            description: 'The orders table has 184,000 rows.',
            options: [
                {
                    value: 'last-30-days',
                    label: 'Last 30 days',
                    description: 'About 12,400 orders.'
                },
                {
                    value: 'quarter',
                    label: 'This quarter',
                    description: 'About 41,000 orders, including refunds.'
                },
                {
                    value: 'all',
                    label: 'All orders',
                    description: 'Every row. The export runs in the background.'
                }
            ]
        },
        {
            title: 'How should amounts be formatted?',
            description: 'Finance opens this file in a spreadsheet.',
            options: [
                {
                    value: 'cents',
                    label: 'Integer cents',
                    description: 'Matches the database, such as 129900.'
                },
                {
                    value: 'decimal',
                    label: 'Decimal dollars',
                    description: 'Two decimal places, such as 1299.00.'
                },
                {
                    value: 'currency',
                    label: 'Formatted currency',
                    description: 'With symbol and separators, such as $1,299.00.'
                }
            ]
        },
        {
            title: 'Where should the file go?',
            description: 'Download links expire after seven days.',
            options: [
                {
                    value: 'link',
                    label: 'Download link',
                    description: 'Post a link in this chat when the file is ready.'
                },
                {
                    value: 'bucket',
                    label: 'Shared bucket',
                    description: 'Upload to s3://finance-exports/orders/.'
                },
                {
                    value: 'email',
                    label: 'Email to finance',
                    description: 'Send the file to finance@example.com.'
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
    <Question.Root
        {variant}
        bind:value={answers[step]}
        required={!complete}
        {status}
        {disabled}
        onSubmit={next}
    >
        <Question.Content {step}>
            {#if complete}
                <Question.Title>Ready to export</Question.Title>
                <Question.Description>
                    Check your choices before the export starts. Go back to change one.
                </Question.Description>
                <dl class="grid gap-3 px-3 pt-3 pb-3">
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
